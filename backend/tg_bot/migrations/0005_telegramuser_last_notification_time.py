# Generated by Django 4.2.5 on 2024-10-13 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tg_bot', '0004_alter_telegramuser_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='telegramuser',
            name='last_notification_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
