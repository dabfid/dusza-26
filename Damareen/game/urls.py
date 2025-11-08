from django.urls import path
from . import views

urlpatterns = [
  path('', views.main, name='main'),
  path('delete/<int:save_id>/', views.delete, name='delete'),
  path('new/', views.new_game, name='new_game'),
  path('play/<int:world_id>/', views.play, name='play'),
]