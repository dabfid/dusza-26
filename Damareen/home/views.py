from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.contrib.auth.models import User


# Create your views here.
def homepage(request):
    logged = False
    if request.user.is_authenticated:
        logged = True
    return render(request, 'homepage.html', {'logged': logged})


from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import IntegrityError

# ...existing code...

def login(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')

            if not username or not password:
                messages.error(request, 'Minden mező kitöltése kötelezö!')
                return render(request, 'login.html')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    return redirect('homepage')
                else:
                    messages.error(request, 'Ez a fiók le van tiltva.')
            else:
                messages.error(request, 'Hibás felhasználónév vagy jelszó.')
        except Exception as e:
            messages.error(request, f'Váratlan hiba történt: {str(e)}')
            
    return render(request, 'login.html')

def register(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')

            # Alapvető validációk
            if not username or not password:
                messages.error(request, 'Minden mezö kitöltése kötelezö!')
                return render(request, 'register.html')

            if len(username) < 3:
                messages.error(request, 'A felhasználónév túl rövid (min. 3 karakter)!')
                return render(request, 'register.html')

            if len(password) < 6:
                messages.error(request, 'A jelszó túl rövid (min. 6 karakter)!')
                return render(request, 'register.html')

            # Felhasználó létrehozása
            if User.objects.filter(username=username).exists():
                messages.error(request, 'A felhasználónév már foglalt.')
                return render(request, 'register.html')

            user = User.objects.create_user(username=username, password=password)
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                auth_login(request, user)
                messages.success(request, 'Sikeres regisztráció!')
                return redirect('homepage')
            else:
                messages.error(request, 'Hiba történt a bejelentkezés során.')

        except IntegrityError:
            messages.error(request, 'A felhasználónév már foglalt.')
        except ValidationError as e:
            messages.error(request, f'Érvénytelen adat: {e.message}')
        except Exception as e:
            messages.error(request, f'Váratlan hiba történt: {str(e)}')

    return render(request, 'register.html')

# ...existing code...


def logout(request):
    from django.contrib.auth import logout as vege
    vege(request)
    return redirect('homepage')