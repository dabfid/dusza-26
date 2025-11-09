
from django.shortcuts import render

def custom_page_not_found_view(request, exception):
    # pl. loggolás
    return render(request, "404.html", status=404)

