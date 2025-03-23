from django.contrib import admin
from django.utils.safestring import mark_safe

from department.employee.models import Teacher, HelpersEmployee


# Register your models here.


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    fieldsets = [

        (
            "Аватар", {
                "fields": ["avatar", "avatar_preview"],
            }
        ),
        (
            "Общая информация", {"fields": ["last_name", "first_name", "patronymic",
                                            "degree", "rank", "position",
                                            "experience", "professional_experience"
                                            ] }
        ),
        (
            "Преподаваемые дисциплины", {"fields": ["subjects"]}
        ),
        (
            "Контакты", {
                "classes": ["collapse"],
                "fields": ["phone_number", "email", "messenger"]
                }
        ),
        (
            "Образование и квалификация", {
                "classes": ["collapse"],
                "fields": ["education", "qualification"] 
                }
        ),
        (
            "Биография", {
                "classes": ["collapse"],
                "fields": ["bio"]
            }
        )

    ]
    readonly_fields = ["avatar_preview"]
    search_fields = ('full_name',)

    def avatar_preview(self, obj):
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" width="150" height="150" style="object-fit: cover;" />')
        return "Аватар не загружен"

    avatar_preview.short_description = "Предпросмотр аватара"


@admin.register(HelpersEmployee)
class HelpersEmployeeAdmin(admin.ModelAdmin):
    fieldsets = [
        (
            "Аватар", {
                "fields": ["avatar", "avatar_preview"],
            }
        ),
        (
            "Общая информация", {
                "fields": ["last_name", "first_name", "patronymic", "position"]
            }
        )
    ]
    readonly_fields = ["avatar_preview"]

    def avatar_preview(self, obj):
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" width="150" height="150" style="object-fit: cover;" />')
        return "Аватар не загружен"

    avatar_preview.short_description = "Предпросмотр аватара"
