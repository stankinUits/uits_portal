from django.db import models
import mdeditor
from mdeditor.fields import MDTextField

# Create your models here.
class EditablePage(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название страницы (для отображения в админ-панели)",
                             blank=True, null=True)
    text = MDTextField(verbose_name='Контент Markdown', blank=True)
    page = models.SlugField(max_length=100, verbose_name='Идентификатор страницы', unique=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    modified_at = models.DateTimeField(auto_now=True, verbose_name='Дата изменения')

    def __str__(self):
        return ("Страница " + self.page + " от " + self.modified_at.date().strftime(
            "%d.%m.%Y")) if not self.title else self.title

    class Meta:
        verbose_name = 'редактируемая страница'
        verbose_name_plural = 'редактируемые страницы'

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
    id_for_unique_identify_component = models.CharField(max_length=50, unique=True, verbose_name="Уникальный идентификатор", default='default_id')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Научная публикация"
        verbose_name_plural = "Научные публикации"