from django.db import models

# CodeDirection Table
class CodeDirection(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'code_directions'

# Discipline Table
class Discipline(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'disciplines'

# LessonType Table
class LessonType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'lesson_types'

# Teacher Table
class Teacher(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'teachers'

# Group Table
class Group(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'groups'

# Semester Table
class Semester(models.Model):
    semester = models.PositiveIntegerField(unique=True)

    class Meta:
        db_table = 'semesters'

# GroupCourse Table
class GroupCourse(models.Model):
    course = models.PositiveIntegerField(unique=True)

    class Meta:
        db_table = 'group_courses'

# Student Table (No Foreign Keys)
class Student(models.Model):
    student_num_in_list = models.PositiveIntegerField(default=0)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    group_name = models.CharField(max_length=100)
    code_direction = models.CharField(max_length=100)


    class Meta:
        db_table = "students"


class OutputForParcingModuleGrade(models.Model):
    teacher = models.CharField(max_length=255)
    discipline = models.CharField(max_length=255)
    group_name = models.CharField(max_length=100)
    id_teachers_in_discipline = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'output_for_parcing_module_grade'
