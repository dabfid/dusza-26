from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('delete/<int:save_id>/', views.delete, name='delete'),
    path('new/', views.new_game, name='new_game'),
    path('choose/<int:world_id>/', views.choose, name='choose'),
    # play most már világot és karaktert is fogad
    path('play/<int:world_id>/<str:character>/', views.play, name='play'),
]