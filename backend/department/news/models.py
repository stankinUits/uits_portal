from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from imagekit.models import ImageSpecField, ProcessedImageField
from imagekit.processors import ResizeToFit
from django_quill.fields import QuillField
from django.utils import timezone

User = get_user_model()


# Create your models here.
class Post(models.Model):
    class PostType(models.TextChoices):
        NEWS = 'NEWS'
        ANNOUNCEMENT = 'ANNOUNCEMENT'

    title = models.CharField(max_length=100, verbose_name="Заголовок", default="")
    short_description = models.TextField(max_length=280, verbose_name="Краткое описание")
    post_type = models.CharField(choices=PostType.choices, default=PostType.NEWS, max_length=12, verbose_name="Тип поста")

    preview_image = ProcessedImageField(
        verbose_name="Превью фото",
        upload_to="photos/%Y/%m/%d",
        processors=[ResizeToFit(800)],  # Указываем только максимальную ширину
        format='JPEG',
        options={'quality': 60},
    )
    preview_thumbnail = ImageSpecField(source="preview_image",
                                       processors=[ResizeToFit(240)],
                                       format='JPEG',
                                       options={'quality': 60})
    preview_image_description = models.CharField(max_length=256, default="", verbose_name="Краткое описание фотографии", blank=True, null=True)

    content = QuillField(verbose_name="Содержание статьи")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    display = models.BooleanField(verbose_name='Отображать?', default=True)
    author = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, verbose_name="Автор")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'пост'
        verbose_name_plural = 'посты'


class Announcement(models.Model):
    title = models.CharField(max_length=100, verbose_name="Заголовок")
    short_description = models.TextField()

class ConferenceAnnouncement(models.Model):
    title = models.CharField(max_length=200, verbose_name="Название конференции")
    description = models.TextField(verbose_name="Описание")
    start_date = models.DateField(verbose_name="Начальная дата проведения")
    end_date = models.DateField(verbose_name="Конечная дата проведения", blank=True, null=True)
    time = models.TimeField(verbose_name="Время проведения", blank=True, null=True)
    organizer = models.CharField(max_length=100, verbose_name="Организатор", blank=True, null=True)
    contact_email = models.EmailField(verbose_name="Контактный email", blank=True, null=True)
    contact_phone = models.CharField(max_length=20, verbose_name="Контактный телефон", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    preview_image = ProcessedImageField(
        verbose_name="Превью изображение",
        upload_to="conference_images/%Y/%m/%d",
        processors=[ResizeToFit(800)],
        format='JPEG',
        options={'quality': 60}
    )
    preview_image_description = models.CharField(max_length=256, verbose_name="Краткое описание фотографии", blank=True, null=True)
    content = QuillField(verbose_name="Содержание статьи", default="")
    is_hidden = models.BooleanField(default=False, verbose_name="Скрыть объявление")


    def __str__(self):
        return self.title

    def clean(self):
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("Дата окончания не может быть раньше даты начала.")

    class Meta:
        verbose_name = "Объявление о конференции"
        verbose_name_plural = "Объявления о конференциях"