# Generated by Django 4.2.5 on 2023-10-20 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0004_alter_post_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='title',
            field=models.CharField(default='', max_length=100, verbose_name='Заголовок'),
        ),
    ]
