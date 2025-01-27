# Generated by Django 4.2.5 on 2025-01-27 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TelegramUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('username', models.CharField(max_length=255)),
                ('chat_id', models.IntegerField()),
                ('last_notification_time', models.DateTimeField(blank=True, null=True)),
            ],
        ),
    ]
