from django.contrib import admin
from department.employee.postgraduate.models import Postgraduate


@admin.register(Postgraduate)
class PostgraduateAdmin(admin.ModelAdmin):
    autocomplete_fields = ('teacher', 'student',)
