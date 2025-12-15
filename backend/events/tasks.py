import logging
import datetime
import os
import subprocess
from pathlib import Path

import pytz
from celery import shared_task
from django.utils import timezone
from events.models import UserEvent, NotificationFrequency
from tg_bot.models import TelegramUser
from uits.settings import BASE_DIR, POSTGRES_USER, POSTGRES_DB, POSTGRES_HOST

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


def cleanup_old_backups(backup_dir: Path, keep_last: int = 3):
    dumps = sorted(backup_dir.glob("db_dump_*.dump"), key=lambda f: f.stat().st_mtime, reverse=True)
    for old_file in dumps[keep_last:]:
        old_file.unlink()


def get_latest_backup(backup_dir: Path) -> str | None:
    dumps = sorted(backup_dir.glob("db_dump_*.dump"), key=lambda f: f.stat().st_mtime, reverse=True)
    if dumps:
        latest_dump_path = dumps[0]
        latest_dump_file_name = latest_dump_path.name
        return latest_dump_file_name


BACKUP_DIR = os.path.join(BASE_DIR, "dumps")


@shared_task
def create_db_backup():
    """
    Создаёт дамп базы данных PostgreSQL.
    """
    os.makedirs(BACKUP_DIR, exist_ok=True)
    dump_file = os.path.join(BACKUP_DIR, f"db_dump_{datetime.datetime.now():%Y-%m-%d_%H-%M-%S}.dump")

    # Команда pg_dump
    command = [
        "pg_dump",
        "-h", POSTGRES_HOST,
        "-U", POSTGRES_USER,
        "-d", POSTGRES_DB,
    ]

    env = os.environ.copy()
    env["PGPASSWORD"] = env["POSTGRES_PASSWORD"]
    try:
        with open(dump_file, "w") as f:
            subprocess.run(command, stdout=f, check=True, env=env)

        cleanup_old_backups(Path(BACKUP_DIR))
        return f"Backup created: {dump_file}"
    except subprocess.CalledProcessError as e:
        return f"Backup failed: {e}"


@shared_task
def restore_db_dump_file(selected_dump_file_name: str = None):
    if not selected_dump_file_name:
        selected_dump_file_name = get_latest_backup(Path(BACKUP_DIR))

    dump_file_path = f"/code/dumps/{selected_dump_file_name}"
    command = [
        "psql",
        "-h", POSTGRES_HOST,
        "-U", POSTGRES_USER,
        "-d", POSTGRES_DB,
        "-f", dump_file_path
    ]
    env = os.environ.copy()
    env["PGPASSWORD"] = env["POSTGRES_PASSWORD"]

    try:
        subprocess.run(command, check=True, env=env)
        return f"Backup applied: {selected_dump_file_name}"
    except subprocess.CalledProcessError as e:
        return f"Backup failed: {e}"