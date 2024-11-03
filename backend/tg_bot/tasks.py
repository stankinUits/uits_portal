import asyncio
import threading
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from tg_bot.models import TelegramUser
from events.models import UserEvent

@shared_task
def send_periodic_notifications():
    now = timezone.now()
    for event in UserEvent.objects.filter(notification_frequency__in=['daily', 'weekly', 'monthly']):
        last_notification = event.last_notification_time or event.created_at
        if event.notification_frequency == 'daily' and now >= last_notification + timedelta(days=1):
            event.notify("Ежедневное напоминание")
            event.last_notification_time = now
        elif event.notification_frequency == 'weekly' and now >= last_notification + timedelta(weeks=1):
            event.notify("Еженедельное напоминание")
            event.last_notification_time = now
        elif event.notification_frequency == 'monthly' and now >= last_notification + timedelta(days=30):
            event.notify("Ежемесячное напоминание")
            event.last_notification_time = now
        event.save()

# Запускаем задачу каждые 24 часа
send_periodic_notifications.apply_async(countdown=86400)
