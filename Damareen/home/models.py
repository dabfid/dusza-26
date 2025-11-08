from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone



class Characters(models.Model):
    name = models.CharField(max_length=16)
    dmg = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(100)
            
        ]
    )
    hp  = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(100)
            
        ]
    )
    type = models.CharField(max_length=16)
    image_path = models.CharField(max_length=512)



class Saves(models.Model):
    world   = models.ForeignKey("Worlds", on_delete=models.CASCADE)
    save_data  = models.TextField()
    datum = models.DateTimeField(auto_now_add=True)
    profile = models.ForeignKey(User, on_delete=models.CASCADE)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=64, blank=True)


class Worlds(models.Model):
    name = models.CharField(max_length=64)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    level_data  = models.TextField()









