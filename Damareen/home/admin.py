from django.contrib import admin
from .models import Characters, Saves, Profile, Worlds

@admin.register(Characters)
class CharactersAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'dmg', 'hp')
    search_fields = ('name', 'type')

@admin.register(Saves)
class SavesAdmin(admin.ModelAdmin):
    list_display = ('id', 'world_id', 'datum')
    readonly_fields = ('datum',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'save')
    search_fields = ('user__username', 'name')

@admin.register(Worlds)
class WorldsAdmin(admin.ModelAdmin):
    list_display = ('id', 'creator_id')