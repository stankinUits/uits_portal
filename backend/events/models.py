import datetime
import pytz
from django.contrib.auth import get_user_model
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

User = get_user_model()


def color_validator(value: str):
    if not value.lower().startswith("#"):
        raise ValidationError(
            "%(value)s is not starting with #",
            params={"value": value},
        )


class NotificationFrequency(models.TextChoices):
    MINUTELY = 'minutely', 'Minutely'
    DAILY = 'daily', 'Daily'
    WEEKLY = 'weekly', 'Weekly'
    MONTHLY = 'monthly', 'Monthly'
    NONE = 'none', 'None'  # For no automatic notifications


class StatusChoice(models.TextChoices):
    NOT_STARTED = 'not_started', _('Not Started')
    IN_PROGRESS = 'in_progress', _('In Progress')
    COMPLETED = 'completed', _('Completed')


class UserEvent(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)

    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    all_day = models.BooleanField(default=False)
    assigned_users = models.ManyToManyField(User, related_name='user_events')

    color = models.CharField(default="#000000", max_length=7, validators=[color_validator])

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')

    start_notified = models.BooleanField(default=False)
    notification_frequency = models.CharField(
        max_length=10,
        choices=NotificationFrequency.choices,
        default=NotificationFrequency.NONE,
    )
    last_notified_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=StatusChoice.choices,
        default=StatusChoice.NOT_STARTED,
    )

    def notify(self, notification_name: str):
        """Send notification to assigned users about the event."""
        tz = pytz.timezone('Europe/Moscow')
        started_at = self.started_at.astimezone(tz).strftime("%Y-%m-%d %H:%M:%S" if not self.all_day else "%Y-%m-%d")
        ended_at = self.ended_at.astimezone(tz).strftime("%Y-%m-%d %H:%M:%S" if not self.all_day else "%Y-%m-%d")
        duration = f"{started_at} - {ended_at}" if not self.all_day else f"Весь день с {started_at} по {ended_at}"
        assigned_at = ", ".join(f"{u.last_name} {u.first_name}" for u in self.assigned_users.all())

        for user in self.assigned_users.all():
            try:
                tg_user = user.telegram_user
                tg_user.send_message(
                    f"""{notification_name}\n\n\nСобытие: "{self.name}"\n\nВремя: {duration}\n\nНазначено на: {assigned_at}\n\nОписание: {self.description}\n\nСоздатель: {self.user.last_name} {self.user.first_name}"""
                )
                tg_user.last_notification_time = timezone.now()
                tg_user.save()
            except User.telegram_user.RelatedObjectDoesNotExist:
                print(f"Telegram account does not exist for {user.username}")
   
    def mark_as_started(self):
        self.status = StatusChoice.IN_PROGRESS
        self.save()

    def mark_as_completed(self):
        self.status = StatusChoice.COMPLETED
        self.save()
