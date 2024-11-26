# Generated by Django 4.2.5 on 2024-10-21 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0009_alter_teacher_degree_alter_teacher_rank'),
    ]

    operations = [
        migrations.AddField(
            model_name='teacher',
            name='email',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Почта'),
        ),
        migrations.AddField(
            model_name='teacher',
            name='experience',
            field=models.IntegerField(blank=True, null=True, verbose_name='Общий стаж работы'),
        ),
        migrations.AddField(
            model_name='teacher',
            name='messanger',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Мессенджер'),
        ),
        migrations.AddField(
            model_name='teacher',
            name='phone_number',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Телефон'),
        ),
        migrations.AddField(
            model_name='teacher',
            name='professional_experience',
            field=models.IntegerField(blank=True, null=True, verbose_name='Стаж работы по специальности'),
        ),
    ]