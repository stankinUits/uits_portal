from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime


class Student(models.Model):

    # Уровень образования студента
    class EducationLevel(models.TextChoices):
        BACHELOR = 'Бакалавриат'
        MASTER = "Магистратура"
        POSTGRADUATE = "Аспирантура"
        SPECIALIST = "Специалитет"

    # Основная информация
    last_name = models.CharField(max_length=50, verbose_name="Фамилия")
    first_name = models.CharField(max_length=50, verbose_name="Имя")
    patronymic = models.CharField(max_length=50, blank=True, null=True, verbose_name="Отчество")

    group = models.CharField(max_length=16, verbose_name="Группа")
    education_level = models.CharField(max_length=50, choices=EducationLevel.choices, verbose_name="Уровень образования")

    speciality = models.CharField(max_length=100, blank=True, null=True, verbose_name="Научная специальность")
    diploma_theme = models.TextField(blank=True, null=True, verbose_name="Тема ВКР")
    admission_year = models.PositiveIntegerField(
        verbose_name="Год поступления",
        validators=[
            MinValueValidator(2000),
            MaxValueValidator(datetime.datetime.now().year)
        ]
    )

    def clean(self):
        current_year = datetime.datetime.now().year
        if self.admission_year > current_year:
            raise ValidationError({"admission_year": "Год поступления не может быть в будущем."})
        if self.admission_year < 2000:
            raise ValidationError({"admission_year": "Год поступления не может быть раньше 2000 года."})

        super().clean()

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return self.last_name + ' ' + (self.first_name if self.first_name else '') + ' ' + (self.patronymic if self.patronymic else '')


    class Meta:
        verbose_name = "Студент"
        verbose_name_plural = "Студенты"