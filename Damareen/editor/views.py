from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from home.models import Worlds
from home.utils import get_static_images
from django.templatetags.static import static

@login_required(login_url='login')
def index(request):
  worlds = Worlds.objects.filter(creator__id = request.user.id)
  return render(request, "editor_main.html", {"worlds": worlds})

@login_required(login_url='login')
def editor(request, id):
  try:
    world = Worlds.objects.get(id=id)
  except Worlds.DoesNotExist:
    return redirect('index')

  if (world.creator.id != request.user.id):
    return redirect('index')

  images = [
      get_static_images('kepek/kartyak/dirt'),
      get_static_images('kepek/kartyak/water'),
      get_static_images('kepek/kartyak/fire'),
      get_static_images('kepek/kartyak/air'),
  ]
  
  image_urls = [[static(path) for path in pair] for pair in images]

  return render(request, "editor.html", {"world": world, "image_urls": image_urls})

@login_required(login_url='login')
def delete(request, world_id):
    try:
        world_to_delete = Worlds.objects.get(id=world_id, creator__id=request.user.id)
        world_to_delete.delete()
    except Worlds.DoesNotExist:
        pass
    return redirect('index')

@login_required(login_url='login')
def create(request):
    new_world = Worlds.objects.create(creator_id=request.user.id, name="Új világ", level_data="")
    return redirect('editor', id=new_world.id)

