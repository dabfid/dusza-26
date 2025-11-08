from django.urls import path
from . import views
from . import api

urlpatterns = [
  path('', views.index, name='index'),
  path('edit/', views.editor, name='editor'),
  path('worlds/', api.index, name='worlds_get'),
  path('worlds/<int:id>', api.get, name='worlds_get'),
  path('worlds/create', api.create, name='worlds_create'),
  path('worlds/update/<int:id>', api.update, name='worlds_update'),
  path('worlds/delete/<int:id>', api.delete, name='worlds_delete'),
]