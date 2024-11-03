from celery import shared_task
from django.utils import timezone
from django.conf import settings
from datetime import timedelta

from events.models import UserEvent, NotificationFrequency
from django.db.models import Q

# logger = get_task_logger(__name__)


@shared_task
def send_periodic_event_notifications():
    now = timezone.now()
    events = UserEvent.objects.filter(
        notification_frequency__in=[
            NotificationFrequency.MINUTELY,
            NotificationFrequency.DAILY,
            NotificationFrequency.WEEKLY,
            NotificationFrequency.MONTHLY,
        ]
    ).distinct()

    for event in events:
        # Determine the time since the last notification
        if event.last_notified_at:
            delta = now - event.last_notified_at
        else:
            delta = timedelta.max  # Ensure the first notification is sent

        should_notify = False

        if event.notification_frequency == NotificationFrequency.MINUTELY and delta >= timedelta(minutes=1):
            should_notify = True
        elif event.notification_frequency == NotificationFrequency.DAILY and delta >= timedelta(days=1):
            should_notify = True
        elif event.notification_frequency == NotificationFrequency.WEEKLY and delta >= timedelta(weeks=1):
            should_notify = True
        elif event.notification_frequency == NotificationFrequency.MONTHLY and delta >= timedelta(days=30):
            should_notify = True

        if should_notify:
            event.notify("Автоматическое напоминание о событии")
            event.last_notified_at = now
            event.save()
