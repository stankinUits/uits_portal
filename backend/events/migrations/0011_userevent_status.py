# Generated by Django 4.2.5 on 2024-11-21 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0010_alter_userevent_notification_frequency'),
    ]

    operations = [
        migrations.AddField(
            model_name='userevent',
            name='status',
            field=models.CharField(choices=[('not_started', 'Not Started'), ('in_progress', 'In Progress'), ('completed', 'Completed')], default='not_started', max_length=20),
        ),
    ]