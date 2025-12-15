from django.contrib import admin
from rangefilter.filters import DateRangeFilter

from archive.admin_tools.admin_utils import get_semester_label
from archive.admin_tools.filters import SemesterFilter


class ArchiveAdminMixin(admin.ModelAdmin):
    """
    Универсальный миксин для админки архивных моделей.
    Предполагает наличие поля `archived_at` и метода __str__.
    """
    list_display = ["__str__", "archived_at", "semester"]
    ordering = ["-archived_at"]
    readonly_fields = ["archived_at"]
    list_per_page = 25
    base_list_filter = [
        ("archived_at", DateRangeFilter),
        SemesterFilter
    ]

    def get_list_filter(self, request):
        return self.base_list_filter

    def has_add_permission(self, request):
        """Запрещаем ручное добавление архивных объектов."""
        return False

    def has_change_permission(self, request, obj=None):
        """Запрещаем редактирование архивных объектов."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Разрешаем удаление архива при необходимости."""
        return True

    @staticmethod
    def semester(obj):
        archived_date = obj.archived_at
        return get_semester_label(archived_date)

    semester.short_description = "Семестр архивирования"
