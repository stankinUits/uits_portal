# Generated by Django 4.2.5 on 2024-10-28 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_name', models.CharField(max_length=50, verbose_name='Фамилия')),
                ('first_name', models.CharField(max_length=50, verbose_name='Имя')),
                ('patronymic', models.CharField(blank=True, max_length=50, null=True, verbose_name='Отчество')),
                ('group', models.CharField(max_length=16, verbose_name='Группа')),
                ('education_level', models.CharField(choices=[('Бакалавриат', 'Bachelor'), ('Магистратура', 'Master'), ('Аспирантура', 'Postgraduate'), ('Специалитет', 'Specialist')], max_length=50, verbose_name='Уровень образования')),
                ('speciality', models.CharField(blank=True, max_length=100, null=True, verbose_name='Научная специальность')),
                ('diploma_theme', models.TextField(blank=True, null=True, verbose_name='Тема ВКР')),
            ],
        ),
    ]
