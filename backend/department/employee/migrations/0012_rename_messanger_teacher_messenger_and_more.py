# Generated by Django 4.2.5 on 2024-10-21 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0011_teacher_education_teacher_qualification'),
    ]

    operations = [
        migrations.RenameField(
            model_name='teacher',
            old_name='messanger',
            new_name='messenger',
        ),
        migrations.AlterField(
            model_name='teacher',
            name='experience',
            field=models.IntegerField(blank=True, null=True, verbose_name='Общий стаж работы (в годах)'),
        ),
        migrations.AlterField(
            model_name='teacher',
            name='professional_experience',
            field=models.IntegerField(blank=True, null=True, verbose_name='Стаж работы по специальности (в годах)'),
        ),
    ]
