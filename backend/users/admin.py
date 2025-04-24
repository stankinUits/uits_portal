from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

User = get_user_model()


# Register your models here.

@admin.register(User)
class UserModelAdmin(UserAdmin):
    readonly_fields = ('telegram_code',)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "avatar",)}),
        (_('Telegram'), {'fields': ('telegram_code',)}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Роли"), {"fields": (
            "is_superuser",
            "is_moderator",
            "is_teacher"
        )}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_('Teacher'), {'fields': ('teacher',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_staff', 'is_active', 'is_moderator', 'is_teacher', 'teacher'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_moderator', 'is_teacher', 'teacher')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_moderator', 'is_teacher', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)
