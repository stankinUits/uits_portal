from django.db import models

# Create your models here.
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
    