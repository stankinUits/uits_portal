# Generated by Django 4.2.5 on 2024-10-28 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subject', '0002_alter_subject_options'),
        ('employee', '0013_teacher_subjects'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacher',
            name='subjects',
            field=models.ManyToManyField(related_name='subjects', to='subject.subject', verbose_name='Дисциплины'),
        ),
    ]
