# Generated by Django 4.2.5 on 2024-10-09 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('achievements', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievement',
            name='description',
            field=models.TextField(verbose_name='Краткое описание'),
        ),
    ]