from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('delete/<int:save_id>/', views.delete, name='delete'),
    path('new/', views.new_game, name='new_game'),
    path('choose/<int:world_id>/<int:difficulty>/', views.choose, name='choose'),
    # play most már világot és karaktert is fogad
    path('result/<int:world_id>/', views.result, name='result'),
    path('difficulty/<int:world_id>', views.dif, name='dif'),
    path('upgrade/<int:world_id>/', views.upgrade, name='upgrade'),
]