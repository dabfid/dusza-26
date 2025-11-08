from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound
from home.models import Worlds
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

@require_http_methods(["GET"])
@login_required(login_url='login')
@csrf_exempt
def all(request):
    worlds = Worlds.objects
    data = list(worlds.values('id', 'name', 'level_data'))
    return JsonResponse({'worlds': data})

@require_http_methods(["GET"])
@login_required(login_url='login')
@csrf_exempt
def index(request):
    worlds = Worlds.objects.filter(creator__id=request.user.id)
    data = list(worlds.values('id', 'name', 'level_data'))
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
            'level_data': world.level_data,
        })
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('Világ nem található')
    
@require_http_methods(["POST"])
@login_required(login_url='login')
@csrf_exempt
def create(request):
    data = json.loads(request.body)
    world = Worlds.objects.create(
        creator_id=request.user.id,
            name=data.get('name', ''),
            level_data=data.get('level_data', '')
        )
    return JsonResponse({'id': world.id})

@require_http_methods(["PUT"])
@login_required(login_url='login')
@csrf_exempt
def update(request, id):
    data = json.loads(request.body)
    
    try:
        world = Worlds.objects.get(id=id, creator__id=request.user.id)
        world.name = data.get('name', world.name)
        world.level_data = data.get('level_data', world.level_data)
        world.save()
        return JsonResponse({'success': True})
    except Worlds.DoesNotExist:
        return HttpResponseNotFound('Világ nem található')

@require_http_methods(["DELETE"])
@login_required(login_url='login')
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