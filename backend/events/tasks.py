import logging
import datetime
import pytz
from celery import shared_task
from django.utils import timezone

from .models import UserEvent, NotificationFrequency
from tg_bot.models import TelegramUser


logger = logging.getLogger(__name__)


@shared_task
def send_event_notifications():
    # Получаем текущий момент времени
    now = timezone.now()

    # Получаем все события, для которых нужно отправить уведомление
    upcoming_events = UserEvent.objects.filter(
        started_at__gte=now,
        start_notified=False,
        notification_frequency__in=[choice[0] for choice in NotificationFrequency.choices]
    )

    for event in upcoming_events:
        # Проверяем, нужно ли отправить уведомление на основе частоты
        if event.notification_frequency == NotificationFrequency.MINUTELY:
            # Отправить уведомление за несколько минут до начала
            if event.started_at - now <= datetime.timedelta(minutes=5):
                send_notifications_for_event(event)
        elif event.notification_frequency == NotificationFrequency.DAILY:
            # Отправить уведомление за день до начала
            if event.started_at - now <= datetime.timedelta(days=1):
                send_notifications_for_event(event)
        elif event.notification_frequency == NotificationFrequency.WEEKLY:
            # Отправить уведомление за неделю до начала
            if event.started_at - now <= datetime.timedelta(weeks=1):
                send_notifications_for_event(event)
        elif event.notification_frequency == NotificationFrequency.MONTHLY:
            # Отправить уведомление за месяц до начала
            if event.started_at - now <= datetime.timedelta(weeks=4):
                send_notifications_for_event(event)

    # Обновляем флаг уведомления о начале
    upcoming_events.update(start_notified=True)


@shared_task
def schedule_notify_bot():
    logger.info('USER EVENTS START CHECK')
    now = datetime.now().astimezone(pytz.timezone('Europe/Moscow'))
    for event in UserEvent.objects.filter(start_notified=False, started_at__lt=now.isoformat()):
        event.notify("Уведомление о начале события")
        event.start_notified = True
        event.save()


def send_notifications_for_event(event):
    users_to_notify = event.assigned_users.all()

    for user in users_to_notify:
        try:
            telegram_user = TelegramUser.objects.get(assigned_user=user)
            message = f"Reminder: The event '{event.name}' will start at {event.started_at.strftime('%Y-%m-%d %H:%M:%S')}."
            logger.info(f"Sending message to {user.username}: {message}")
            telegram_user.send_message(message)
        except TelegramUser.DoesNotExist:
            logger.warning(f"No TelegramUser found for {user.username}")
