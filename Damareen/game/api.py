from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from home.models import Worlds, Saves
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import datetime
import json

@require_http_methods(["GET"])
@login_required(login_url='login')
def get(request):
    try:
        world_id = request.GET.get('id') 
        
        save = Saves.objects.filter(world=world_id, profile=request.user.id).first()
        return JsonResponse({
            'id': save.id,
            'world': save.world.id,
            'save_data': json.loads(save.save_data),
            'datum': save.datum.isoformat()
        })
    except Saves.DoesNotExist:
        return JsonResponse({'hiba': 'Mentés nem található'}, status=404)

@require_http_methods(["GET"])
@login_required(login_url='login')
def gettwo(request):
    try:
        save_id = request.GET.get('id') 
        
        save = Saves.objects.filter(id=save_id, profile=request.user.id).first()
        return JsonResponse({
            'id': save.id,
            'world': save.world.id,
            'save_data': json.loads(save.save_data),
            'datum': save.datum.isoformat()
        })
    except Saves.DoesNotExist:
        return JsonResponse({'hiba': 'Mentés nem található'}, status=404)

@require_http_methods(["DELETE"])
@login_required(login_url='login')
@csrf_exempt
def delete(request, id):
    try:
        save = Saves.objects.get(id=id, profile=request.user)
        save.delete()
        return HttpResponse(status=204)
    except Saves.DoesNotExist:
        return JsonResponse({'hiba': 'Mentés nem található'}, status=404)

@require_http_methods(["POST"])
@login_required(login_url='login')
@csrf_exempt
def update_or_create(request):
    try:
        data = json.loads(request.body)
        save_id = request.GET.get('id') 
        
        defaults = {}
        if 'save_data' in data:
            defaults['save_data'] = json.dumps(data['save_data'])
        if 'world' in data:
            defaults['world_id'] = data['world']
        defaults['datum'] = datetime.datetime.now()
        
        if save_id:
            save, created = Saves.objects.update_or_create(
                id=save_id,
                profile=request.user,
                defaults=defaults
            )
        else:
            save = Saves.objects.create(profile=request.user, **defaults)
            created = True
        
        return JsonResponse({'id': save.id})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)