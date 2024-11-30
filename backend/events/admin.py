from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import UserEvent, StatusChoice


class StatusFilter(admin.SimpleListFilter):
    title = _('Status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            (status.value, status.label)
            for status in StatusChoice
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(status=self.value())
        return queryset


@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ('name', 'started_at', 'ended_at', 'all_day', 'notification_frequency', 'user')
    search_fields = ('name', 'user__username', 'description')
    list_filter = ('status', 'all_day', 'started_at', 'ended_at')
    ordering = ('-started_at',)
