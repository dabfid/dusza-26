from django.urls import path
from . import views
from . import api

urlpatterns = [
  path('', views.index, name='index'),
  path('new/', views.create, name='create'),
  path('edit/<int:id>', views.editor, name='editor'),
  path('worlds/', api.index, name='worlds_index'),
  path('worlds/all', api.all, name='worlds_all'),
  path('worlds/<int:id>', api.get, name='worlds_get'),
  path('worlds/create', api.create, name='worlds_create'),
  path('worlds/update/<int:id>', api.update, name='worlds_update'),
  path('worlds/delete/<int:world_id>', views.delete, name='worlds_delete'),
]