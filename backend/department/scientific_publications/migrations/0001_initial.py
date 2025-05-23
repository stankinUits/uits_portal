# Generated by Django 4.2.5 on 2025-01-27 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
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
                ('name', models.CharField(max_length=200, verbose_name='Название публикации')),
                ('author', models.JSONField(verbose_name='Авторы')),
                ('description', models.TextField(verbose_name='Описание')),
                ('url', models.URLField(blank=True, null=True, verbose_name='Ссылка')),
                ('file', models.TextField(blank=True, null=True, verbose_name='PDF файл (base64)')),
                ('year', models.IntegerField(verbose_name='Год')),
                ('source', models.CharField(max_length=200, verbose_name='Источник')),
                ('pages', models.CharField(blank=True, max_length=50, null=True, verbose_name='Страницы')),
                ('vol_n', models.CharField(blank=True, max_length=100, null=True, verbose_name='Том и номер')),
                ('isbn', models.CharField(blank=True, max_length=20, null=True, verbose_name='ISBN')),
                ('id_for_unique_identify_component', models.CharField(default='default_id', max_length=50, unique=True, verbose_name='Уникальный идентификатор')),
                ('tags', models.ManyToManyField(to='scientific_publications.tag', verbose_name='Теги')),
            ],
            options={
                'verbose_name': 'Научная публикация',
                'verbose_name_plural': 'Научные публикации',
            },
        ),
    ]
