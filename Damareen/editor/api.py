from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from home.models import Worlds
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

@require_http_methods(["GET"])
@login_required
@csrf_exempt
def index(request):
    worlds = Worlds.objects.filter(creator__id=request.user.id)
    data = list(worlds.values('id', 'name', 'collection_cards', 'world_cards', 'challenges'))
    return JsonResponse({'worlds': data})

@require_http_methods(["GET"])
@login_required
@csrf_exempt
def get(request, id):
    try:
        world = Worlds.objects.get(id=id, creator__id=request.user.id)
        return JsonResponse({
            'id': world.id,
            'name': world.name,
            'collection_cards': world.collection_cards,
            'world_cards': world.world_cards,
            'challenges': world.challenges
        })
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('Világ nem található')
    
@require_http_methods(["POST"])
@login_required
@csrf_exempt
def create(request):
    data = json.loads(request.body)
    world = Worlds.objects.create(
        creator_id=request.user,
            name=data.get('name', ''),
            collection_cards=data.get('collection_cards', ''),
            world_cards=data.get('world_cards', ''),
            challenges=data.get('challenges', '')
        )
    return JsonResponse({'id': world.id})

@require_http_methods(["PUT"])
@login_required
@csrf_exempt
def update(request):
    data = json.loads(request.body)
    world_id = data.get('id')
    
    try:
        world = Worlds.objects.get(id=world_id, creator__id=request.user.id)
        world.name = data.get('name', world.name)
        world.collection_cards = data.get('collection_cards', world.collection_cards)
        world.world_cards = data.get('world_cards', world.world_cards)
        world.challenges = data.get('challenges', world.challenges)
        world.save()
        return JsonResponse({'success': True})
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('Világ nem található')

@require_http_methods(["DELETE"])
@login_required
@csrf_exempt
def delete(request):
    data = json.loads(request.body)
    world_id = data.get('id')
    
    try:
        world = Worlds.objects.get(id=world_id, creator_id=request.user)
        world.delete()
        return JsonResponse({'success': True})
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('Világ nem található')