# Generated by Django 4.2.5 on 2024-10-13 15:40

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0006_alter_usereventstatus_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userevent',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2024, 10, 13, 15, 40, 48, 198496, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
    ]
