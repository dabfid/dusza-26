from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.main, name='main'),
    path('delete/<int:save_id>/', views.delete, name='delete'),
    path('new/', views.new_game, name='new_game'),
    path('play/<int:world_id>/<int:difficulty>/', views.play, name='play'),
    # play most már világot és karaktert is fogad
    path('difficulty/<int:world_id>', views.dif, name='dif'),
    path('upgrade/<int:world_id>/<int:difficulty>', views.upgrade, name='upgrade'),
    path('api/get/', api.get, name='api_get'),
    path('api/get2/', api.gettwo, name='api_gettwo'),
    path('api/delete/<int:id>/', api.delete, name='api_delete'),
    path('api/update_or_create/', api.update_or_create, name='api_update_or_create'),
]