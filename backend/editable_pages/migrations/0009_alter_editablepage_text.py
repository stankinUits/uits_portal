# Generated by Django 4.2.5 on 2024-10-24 10:27

from django.db import migrations
import mdeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('editable_pages', '0008_editablepage_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='editablepage',
            name='text',
            field=mdeditor.fields.MDTextField(blank=True, verbose_name='Контент Markdown'),
        ),
    ]
