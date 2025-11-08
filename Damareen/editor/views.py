from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(redirect_field_name='{% url "login" %}')
def index(request):
  return render(request, "editor_main.html")

@login_required(redirect_field_name='{% url "login" %}')
def editor(request):
  return render(request, "editor.html")