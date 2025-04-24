from django.contrib.auth.models import AbstractUser
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit

from tg_bot.utils import generate_telegram_code


class User(AbstractUser):
    avatar = ProcessedImageField(
        verbose_name="Аватар пользователя",
        upload_to="photos/avatars/%Y/%m/%d",
        processors=[ResizeToFit(512)],
        format='JPEG',
        options={'quality': 90},
        null=True,
        blank=True,
        default=None
    )
    is_moderator = models.BooleanField(default=False, verbose_name="Статус модератора", help_text="Указывает, что пользователь имеет права модератора.")
    is_teacher = models.BooleanField(default=False, verbose_name="Статус преподавателя", help_text="Указывает, что пользователь имеет права преподавателя.")
    teacher = models.OneToOneField(
        'employee.Teacher',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Связанный преподаватель",
        help_text="Преподаватель, связанный с данным пользователем",
        unique=False
    )

    telegram_code = models.CharField(editable=False, max_length=12, unique=True)

    def __str__(self):
        if self.first_name and self.last_name:
            return self.first_name + ' ' + self.last_name
        else:
            return self.username

    def regenerate_telegram_code(self):
        self.telegram_code = generate_telegram_code()
        self.save()

    def save(self, *args, **kwargs):
        self.telegram_code = generate_telegram_code()
        super().save(*args, **kwargs)
