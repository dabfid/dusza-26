from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from home.models import Worlds
import json


@login_required(redirect_field_name='{% url "login" %}')
def get(request):
    world_id = request.GET.get('id')
    if not world_id:
        return HttpResponseBadRequest('ID required')
    
    try:
        world = Worlds.objects.get(id=world_id, creator_id=request.user)
        return JsonResponse({
            'id': world.id,
            'collection_cards': world.collection_cards,
            'world_cards': world.world_cards,
            'challenges': world.challenges
        })
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('World not found')


@login_required(redirect_field_name='{% url "login" %}')
def index(request):
    if request.method == 'GET':
        worlds = Worlds.objects.filter(creator_id=request.user)
        data = list(worlds.values('id', 'collection_cards', 'world_cards', 'challenges'))
        return JsonResponse({'worlds': data})
    
    if request.method == 'POST':
        data = json.loads(request.body)
        world = Worlds.objects.create(
            creator_id=request.user,
            collection_cards=data.get('collection_cards', ''),
            world_cards=data.get('world_cards', ''),
            challenges=data.get('challenges', '')
        )
        return JsonResponse({'id': world.id})


@login_required(redirect_field_name='{% url "login" %}')
def update(request):
    data = json.loads(request.body)
    world_id = data.get('id')
    
    try:
        world = Worlds.objects.get(id=world_id, creator_id=request.user)
        world.collection_cards = data.get('collection_cards', world.collection_cards)
        world.world_cards = data.get('world_cards', world.world_cards)
        world.challenges = data.get('challenges', world.challenges)
        world.save()
        return JsonResponse({'success': True})
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('World not found')


@login_required(redirect_field_name='{% url "login" %}')
def delete(request):
    data = json.loads(request.body)
    world_id = data.get('id')
    
    try:
        world = Worlds.objects.get(id=world_id, creator_id=request.user)
        world.delete()
        return JsonResponse({'success': True})
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('World not found')