from django.contrib import admin

from archive.admin_tools.admin_utils import archive_objects
from department.employee.guidance.models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'last_name',
        'first_name',
        'patronymic',
        'group',
        'education_level',
        'speciality',
        'diploma_theme'
    )
    search_fields = ('full_name',)

    actions = [archive_objects]
