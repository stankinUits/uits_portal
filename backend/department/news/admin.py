from django.contrib import admin
from .models import Post, ConferenceAnnouncement, Announcement
from django.utils.translation import gettext_lazy as _

# Register your models here.
@admin.register(Post)
class PostModelAdmin(admin.ModelAdmin):
    fieldsets = (
        (_("Основная информация"), {'fields': ('title', 'short_description', 'post_type', 'content', 'author')}),
        (_("Изображение"), {'fields': ('preview_image', 'preview_image_description')}),
        (_("Настройки отображения"), {'fields': ('display', 'created_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at',)
    list_display = ('title', 'post_type', 'author', 'created_at', 'display')
    list_filter = ('post_type', 'display', 'created_at', 'author')
    search_fields = ('title', 'short_description', 'content')

@admin.register(ConferenceAnnouncement)
class ConferenceAnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'time', 'location', 'organizer', 'created_at')
    search_fields = ('title', 'description', 'location', 'organizer')
    list_filter = ('date', 'created_at', 'updated_at')