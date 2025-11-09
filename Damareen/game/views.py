from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from home.models import Saves, Worlds
from django.shortcuts import redirect
from django.templatetags.static import static
from django.contrib import messages
from home.utils import get_static_images
import json
import random

@login_required(login_url='login')
def main(request):
    user_saves = Saves.objects.filter(profile=request.user)
    return render(request, 'game_main.html', {'saves': user_saves})


@login_required(login_url='login')
def delete(request, save_id):
    try:
        save_to_delete = Saves.objects.get(id=save_id, profile=request.user)
        save_to_delete.delete()
        messages.success(request, 'Mentés sikeresen törölve.')
    except Saves.DoesNotExist:
        messages.error(request, 'A mentés nem található vagy nincs jogosultságod a törléséhez.')
    return redirect('main')


@login_required(login_url='login')
def new_game(request):
    world_list = Worlds.objects.all()
    if world_list.count() == 0:
        messages.info(request, 'Nincsenek elérhető világok új játék indításához. Kérlek, hozz létre egy világot először.')
        return redirect('main')
    return render(request, 'new_game.html', {'worlds': world_list})



@login_required(login_url='login')
def play(request, world_id, character):
    try:
        # Get world data
        world = Worlds.objects.get(id=world_id)
        world_data = json.loads(world.level_data)
        
        # Parse character data
        char_data = json.loads(character)
        
        # Get the specific card data from worldCards
        selected_card = None
        for card in world_data.get('cardData', {}).get('worldCards', []):
            if card['cardName'] == char_data['name']:
                selected_card = {
                    'name': card['cardName'],
                    'hp': card['cardHp'],
                    'damage': card['cardDmg'],
                    'type': card['cardType']
                }
                break
                
        if not selected_card:
            messages.error(request, 'A választott karakter nem található.')
            return redirect('choose', world_id=world_id)
            
        # Get challenge data
        challenge_data = world_data.get('challengeData', [])
        
        context = {
            'world_id': world_id,
            'character': selected_card,
            'challenge_data': challenge_data,
            'deck_cards': world_data.get('cardData', {}).get('deckCards', [])
        }
        
        return render(request, 'play.html', context)
        
    except Worlds.DoesNotExist:
        messages.error(request, 'A választott világ nem található.')
        return redirect('main')
    except json.JSONDecodeError:
        messages.error(request, 'Hibás karakter vagy világ adat.')
        return redirect('choose', world_id=world_id)


@login_required(login_url='login')
def choose(request, world_id, difficulty):
    if request.method == 'POST':
        # POST kezelés változatlan marad
        print(request.POST)
        raw_data = request.POST.get('cards', '[]')
        try:
            characters = json.loads(raw_data)
        except json.JSONDecodeError:
            characters = []

        if characters:
            selected = characters[0]
            return render(request, 'play.html', {
                'world_id': world_id,
                'selected_characters': characters,
                'first_character': selected
        })
        else:
            return redirect('choose', world_id=world_id, difficulty=difficulty)

    else:
        # GET kérés: world_cards kiolvasása
        world_data = Worlds.objects.get(id=world_id).level_data
        # fix malformed json
        world_data = world_data.replace("'", '"')
        data = json.loads(world_data)
        
        images = [
            get_static_images('kepek/kartyak/dirt'),
            get_static_images('kepek/kartyak/water'),
            get_static_images('kepek/kartyak/fire'),
            get_static_images('kepek/kartyak/air'),
        ]
        
        image_urls = [[static(path) for path in pair] for pair in images]
        
        # Módosított rész: cardData.worldCards használata
        characters = [{
            'name': card['cardName'],
            'hp': card['cardHp'],
            'damage': card['cardDmg'],  # Figyelem: cardDmg, nem cardDamage!
            'type': card['cardType'],
            'imgIndex': card.get('cardBackgroundImageIndex', 0)
        } for card in data.get('cardData', {}).get('worldCards', [])]
        
        
        challengeData = data.get('challengeData', [])
        challenges = [];
        for challenge in challengeData:
            if challenge['difficulty'] == difficulty:
                challenges.append(challenge)

        selected_challenge = random.choice(challenges) if challenges else None

        return render(request, 'choose.html', {
            'world_id': world_id,
            'characters': characters,
            "image_urls": json.dumps(image_urls),
            'difficulty': difficulty,
            'selected_challenge': selected_challenge
        })



def dif(request, world_id):
    if request.method == 'POST':
        difficulty = request.POST.get('difficulty')
        return redirect('choose', world_id=world_id, difficulty=difficulty)
    return render(request, 'difficulty.html', {'world_id': world_id})