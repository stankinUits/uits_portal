# Generated by Django 4.2.5 on 2024-12-04 17:01

from django.db import migrations, models
import django.utils.timezone
import django_quill.fields
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0019_conferenceannouncement'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conferenceannouncement',
            name='date',
        ),
        migrations.RemoveField(
            model_name='conferenceannouncement',
            name='location',
        ),
        migrations.AddField(
            model_name='conferenceannouncement',
            name='content',
            field=django_quill.fields.QuillField(default='', verbose_name='Содержание статьи'),
        ),
        migrations.AddField(
            model_name='conferenceannouncement',
            name='end_date',
            field=models.DateField(blank=True, null=True, verbose_name='Конечная дата проведения'),
        ),
        migrations.AddField(
            model_name='conferenceannouncement',
            name='preview_image',
            field=imagekit.models.fields.ProcessedImageField(default='default.png', upload_to='conference_images/%Y/%m/%d', verbose_name='Превью изображение'),
        ),
        migrations.AddField(
            model_name='conferenceannouncement',
            name='preview_image_description',
            field=models.CharField(blank=True, max_length=256, null=True, verbose_name='Краткое описание фотографии'),
        ),
        migrations.AddField(
            model_name='conferenceannouncement',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now, verbose_name='Начальная дата проведения'),
        ),
        migrations.AlterField(
            model_name='announcement',
            name='title',
            field=models.CharField(max_length=100, verbose_name='Заголовок'),
        ),
        migrations.AlterField(
            model_name='conferenceannouncement',
            name='contact_email',
            field=models.EmailField(blank=True, max_length=254, null=True, verbose_name='Контактный email'),
        ),
        migrations.AlterField(
            model_name='conferenceannouncement',
            name='organizer',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Организатор'),
        ),
        migrations.AlterField(
            model_name='conferenceannouncement',
            name='time',
            field=models.TimeField(blank=True, null=True, verbose_name='Время проведения'),
        ),
    ]