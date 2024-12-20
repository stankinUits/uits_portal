from django.contrib import admin
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
