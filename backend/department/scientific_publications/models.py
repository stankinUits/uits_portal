from django.db import models
import uuid

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class ScientificPublication(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название публикации")
    author = models.JSONField(verbose_name="Авторы")
    description = models.TextField(verbose_name="Описание")
    url = models.URLField(null=True, blank=True, verbose_name="Ссылка")
    file = models.TextField(null=True, blank=True, verbose_name="PDF файл (base64)")
    tags = models.ManyToManyField(Tag, verbose_name="Теги")
    year = models.IntegerField(verbose_name="Год")
    source = models.CharField(max_length=200, verbose_name="Источник")
    pages = models.CharField(max_length=50, null=True, blank=True, verbose_name="Страницы")
    vol_n = models.CharField(max_length=100, null=True, blank=True, verbose_name="Том и номер")
    isbn = models.CharField(max_length=20, null=True, blank=True, verbose_name="ISBN")
    id_for_unique_identify_component = models.CharField(max_length=50, unique=True, verbose_name="Уникальный идентификатор", default=uuid.uuid4)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Научная публикация"
        verbose_name_plural = "Научные публикации"