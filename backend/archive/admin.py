from django.contrib import admin

from archive.admin_tools.admin_mixin import ArchiveAdminMixin
from archive.models import ArchiveStudent

"""employee archive models"""
@admin.register(ArchiveStudent)
class ArchiveStudentAdmin(ArchiveAdminMixin):
    extra_list_filter = [
    ]

    def get_list_filter(self, request):
        return super().get_list_filter(request) + self.extra_list_filter
