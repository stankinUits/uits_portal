# Generated by Django 4.2.5 on 2024-12-08 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('editable_pages', '0009_alter_editablepage_text'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ScientificPublication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('author', models.JSONField()),
                ('description', models.TextField()),
                ('url', models.URLField(blank=True, null=True)),
                ('file', models.FileField(blank=True, null=True, upload_to='')),
                ('year', models.IntegerField()),
                ('source', models.CharField(max_length=200)),
                ('tags', models.ManyToManyField(to='editable_pages.tag')),
            ],
        ),
    ]