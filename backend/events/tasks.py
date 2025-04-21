import logging
import datetime
import pytz
from celery import shared_task
from django.utils import timezone
from events.models import UserEvent, NotificationFrequency
from tg_bot.models import TelegramUser

logger = logging.getLogger(__name__)


@shared_task
def notify_daily():
    """Обработка уведомлений для событий с частотой DAILY."""
    process_notifications(NotificationFrequency.DAILY)


@shared_task
def notify_weekly():
    """Обработка уведомлений для событий с частотой WEEKLY."""
    process_notifications(NotificationFrequency.WEEKLY)


@shared_task
def notify_monthly():
    """Обработка уведомлений для событий с частотой MONTHLY."""
    process_notifications(NotificationFrequency.MONTHLY)


@shared_task
def notify_test():
    """Тестовая задача для отправки уведомлений каждую минуту."""
    process_notifications(NotificationFrequency.DAILY)


def process_notifications(frequency):
    """
    Обработка уведомлений для заданной частоты событий.

    :param frequency: Частота уведомлений (NotificationFrequency)
    """
    now = timezone.now()
    events = UserEvent.objects.filter(
        next_notification_at__lte=now,
        start_notified=True,
        notification_frequency=frequency,
    )

    if not events.exists():
        logger.info(f"No upcoming events found for frequency {frequency}.")
        return

    logger.info(f"Processing {events.count()} events for frequency {frequency}.")

    for event in events:
        try:
            # Отправляем уведомление
            send_notifications_for_event(event)

            # Планируем следующую дату уведомления или сбрасываем флаг start_notified
            if event.started_at <= now:
                event.start_notified = False
            else:
                event.schedule_next_notification()
            event.save()
            logger.info(f"Notification processed for event ID {event.id}.")
        except Exception as e:
            logger.error(f"Error processing event ID {event.id}: {str(e)}")


def send_notifications_for_event(event):
    """
    Отправка уведомлений для конкретного события.

    :param event: Событие, для которого отправляются уведомления.
    """
    try:
        users_to_notify = event.assigned_users.all()
        tz = pytz.timezone('Europe/Moscow')
        started_at = event.started_at.astimezone(tz).strftime("%Y-%m-%d %H:%M:%S" if not event.all_day else "%Y-%m-%d")
        ended_at = event.ended_at.astimezone(tz).strftime("%Y-%m-%d %H:%M:%S" if not event.all_day else "%Y-%m-%d")
        duration = f"{started_at} - {ended_at}" if not event.all_day else f"Весь день с {started_at} по {ended_at}"
        assigned_at = ", ".join(f"{u.last_name} {u.first_name}" for u in event.assigned_users.all())

        logger.info(f"Sending notifications for event '{event.name}' to {len(users_to_notify)} users.")

        for user in users_to_notify:
            try:
                telegram_user = TelegramUser.objects.get(assigned_user=user)
                message = f"""Напоминание: \n\nСобытие: "{event.name}"\n\nВремя: {duration}\n\nНазначено на: {assigned_at}\n\nОписание: {event.description}\n\nСоздатель: {event.user.last_name} {event.user.first_name}"""
                logger.info(f"Sending message to {user.username}: {message}")
                telegram_user.send_message(message)
            except TelegramUser.DoesNotExist:
                logger.warning(f"No TelegramUser found for {user.username}")
    except Exception as e:
        logger.error(f"Error processing event notifications: {str(e)}")
