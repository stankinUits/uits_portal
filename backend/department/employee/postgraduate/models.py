from django.core.exceptions import ValidationError

from django.db import models
from department.employee.models import Teacher
from department.employee.guidance.models import Student
from department.employee.subject.models import Subject


class Postgraduate(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='postgraduate_entries',
        verbose_name="Аспирант",
    )

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='postgraduate_entries',
        verbose_name="Руководитель",
    )

    def clean(self):
        if self.student and self.student.education_level != Student.EducationLevel.POSTGRADUATE:
            raise ValidationError("Студент должен быть аспирантом.")
        super().clean()

    def __str__(self):
        student_name = self.student.full_name if self.student else "Не назначено"
        teacher_name = self.teacher.full_name if self.teacher else "Не назначено"
        return f'{student_name} - {teacher_name}'

    class Meta:
        verbose_name = "Запись аспирантуры"
        verbose_name_plural = "Записи аспирантуры"
