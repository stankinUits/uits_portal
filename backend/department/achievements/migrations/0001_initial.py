# Generated by Django 4.2.5 on 2024-09-24 17:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_quill.fields
import imagekit.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Achievement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Заголовок')),
                ('description', models.TextField(verbose_name='Описание')),
                ('content', django_quill.fields.QuillField(verbose_name='Содержание')),
                ('image', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to='photos/%Y/%m/%d')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Автор')),
            ],
            options={
                'verbose_name': 'достижение',
                'verbose_name_plural': 'достижения',
            },
        ),
    ]
