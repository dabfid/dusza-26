from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from home.models import Saves, Worlds
from django.shortcuts import redirect
from django.templatetags.static import static
from django.contrib import messages
from django.urls import reverse
from home.utils import get_static_images
from game.logic import isEnemyWinning
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
def play(request, world_id, difficulty):
    if request.method == 'POST':
        # GET kérés: world_cards kiolvasása
        world_data = Worlds.objects.get(id=world_id).level_data
        if not world_data:
            return redirect('play', world_id=world_id, difficulty=difficulty)
        # fix malformed json
        world_data = world_data.replace("'", '"')
        world_data = json.loads(world_data)
        
        raw_data = request.POST.get('characters', '[]')
        try:
            deck_data = json.loads(raw_data)
        except json.JSONDecodeError:
            deck_data = []
        if not deck_data:
            return redirect('choose', world_id=world_id, difficulty=difficulty)

        cards = deck_data['cards']
        selected_challenge = int(deck_data['challengeId'])
        
        challengeData = world_data.get('challengeData', [])
        challenges = [];
        for challenge in challengeData:
            if int(challenge['difficulty']) == int(difficulty):
                challenges.append(challenge)
                
        if not challenges: return redirect('choose', world_id=world_id, difficulty=difficulty)
        selected_challenge = challenges[selected_challenge]
        
        wins = []
        for card1, card2 in zip(cards, selected_challenge['cards']):
            wins.append(isEnemyWinning(card1, card2))
        
        images = [
            get_static_images('kepek/kartyak/dirt'),
            get_static_images('kepek/kartyak/water'),
            get_static_images('kepek/kartyak/fire'),
            get_static_images('kepek/kartyak/air'),
        ]
        
        image_urls = [[static(path) for path in pair] for pair in images]
        
        win_count = 0
        for win in wins:
            if not win:
                win_count += 1
        win = win_count >= len(wins)/2
        
        return render(request, 'result.html', {
            'card_data': zip(
                [json.dumps(card) for card in cards],
                [json.dumps(card) for card in selected_challenge['cards']],
                wins
            ),
            'wins': wins,
            'player_cards': cards,
            'enemy_cards': selected_challenge['cards'],
            "image_urls": json.dumps(image_urls),
            'difficulty': difficulty,
            'win': win,
            'world_id': world_id
        })
            
    else:
        save_id = request.GET.get('id')
        save_data = None
        if save_id:
            save_data = Saves.objects.get(id=save_id, profile=request.user).save_data
        # GET kérés: pakli kiválasztása
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
        
        if save_data:
            save_data = save_data.replace("'", '"')
            print(save_data['cards'])
            save_deck_data = json.loads(save_data)
            print(save_deck_data)
            
            """
            characters = [
                {
                    'name': card['cardName'],
                    'hp': int(card['cardHp']),
                    'damage': int(card['cardDmg']),
                    'type': int(card['cardType']),
                    'imgIndex': int(card.get('cardBackgroundImageIndex', 0))
                } 
                for card in save_deck_data['cards']
            ]
            """
        # Módosított rész: deckCards.worldCards használata
        characters = [{
            'name': card['cardName'],
            'hp': card['cardHp'],
            'damage': card['cardDmg'],  # Figyelem: cardDmg, nem cardDamage!
            'type': card['cardType'],
            'imgIndex': card.get('cardBackgroundImageIndex', 0)
        } for card in data.get('cardData', {}).get('deckCards', [])]
        
        
        challengeData = data.get('challengeData', [])
        challenges = [];
        for challenge in challengeData:
            if int(challenge['difficulty']) == int(difficulty):
                challenges.append(challenge)

        selected_challenge = random.randint(0, len(challenges) - 1) if challenges else None

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
        save_id = None
        
        try:
            save_id = request.POST.get('save_id')
        except:
            pass
        if save_id:
            url = reverse('play', args=[world_id, difficulty]) + f'?id={save_id}'
            return redirect(url)
                    
        return redirect('play', world_id=world_id, difficulty=difficulty)
    save_id = request.GET.get('id')
    if save_id:
     return render(request, 'difficulty.html', {'world_id': world_id, 'save_id': save_id})
    return render(request, 'difficulty.html', {'world_id': world_id})

@login_required(login_url='login')
def upgrade(request, world_id, difficulty):
    difficulty = int(difficulty)
    
    world_data = Worlds.objects.get(id=world_id).level_data
    
    if not world_data:
        return redirect('new_game')
    
    world_data = world_data.replace("'", '"')
    data = json.loads(world_data)
    # Módosított rész: deckCards.worldCards használata
    cards = [{
        'name': card['cardName'],
        'hp': card['cardHp'],
        'damage': card['cardDmg'],  # Figyelem: cardDmg, nem cardDamage!
        'type': card['cardType'],
        'imgIndex': card.get('cardBackgroundImageIndex', 0)
    } for card in data.get('cardData', {}).get('deckCards', [])]
    
    images = [
            get_static_images('kepek/kartyak/dirt'),
            get_static_images('kepek/kartyak/water'),
            get_static_images('kepek/kartyak/fire'),
            get_static_images('kepek/kartyak/air'),
        ]
        
    image_urls = [[static(path) for path in pair] for pair in images]
        
    return render(request, 'upgrade.html', {'difficulty': difficulty, 'cards' : cards, "image_urls": json.dumps(image_urls), 'world_id': world_id})