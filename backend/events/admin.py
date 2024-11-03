from django.contrib import admin
from .models import UserEvent


@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ('name', 'started_at', 'ended_at', 'all_day', 'notification_frequency', 'user')
    search_fields = ('name', 'user__username', 'description')
    list_filter = ('all_day', 'started_at', 'ended_at')
    ordering = ('-started_at',)
