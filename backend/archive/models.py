from archive.mixin_model import ArchiveMixin
from department.employee.guidance.models import Student


"""employee archive models"""
class ArchiveStudent(ArchiveMixin):
    original_model = Student

    class Meta:
        verbose_name = "Архивный студент"
        verbose_name_plural = "Архивные студенты"
