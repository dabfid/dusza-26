from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect

def jatekmester_only(view_func):
    """Csak azok férhetnek hozzá, akiknek profile.isJatekmester = True."""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return redirect('/login/')
        if not hasattr(user, 'profile') or not getattr(user.profile, 'isJatekmester', False):
            return HttpResponseForbidden("Nincs jogosultságod az editor használatához.")
        return view_func(request, *args, **kwargs)
    return _wrapped_view