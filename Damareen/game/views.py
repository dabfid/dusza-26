from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from home.models import Saves, Worlds
from django.shortcuts import redirect
from django.contrib import messages

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
    return render(request, 'new_game.html', {'worlds': world_list})

@login_required(login_url='login')
def play(request, world_id):
    return render(request, 'play.html', {'world_id': world_id})