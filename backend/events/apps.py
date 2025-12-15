import sys

from django.apps import AppConfig


class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

    def ready(self):
        # Import celery app now that Django is mostly ready.
        # This initializes Celery and autodiscovers tasks
        import uits.celery

        necessary_commands = {'runserver', 'uwsgi', 'gunicorn', 'runworker'}
        if len(sys.argv) > 1 and sys.argv[1] in necessary_commands:
            self.get_or_create_backup_task()

    @staticmethod
    def get_or_create_backup_task():
        from django_celery_beat.models import PeriodicTask, IntervalSchedule

        # Создание периодической задачи по бекапу базы, в случае если её ещё нет в планировщике
        backup_interval_obj, _ = IntervalSchedule.objects.get_or_create(
            every=7,
            period=IntervalSchedule.DAYS
        )
        backup_task, created = PeriodicTask.objects.get_or_create(
            task="events.tasks.create_db_backup",
            interval=backup_interval_obj
        )
        backup_task_name = "Создание дампа базы данных 7d"
        if created:
            # Имена периодических задач должны быть уникальны, поэтому добавим префикс версии,
            # в случае если существует какая-либо периодическая задача с таким же именем
            backup_tasks_count = PeriodicTask.objects.filter(
                name=backup_task_name,
            ).count()
            if backup_tasks_count > 0:
                backup_task_name += f"v_{backup_tasks_count + 1}"
            backup_task.name = backup_task_name
            backup_task.save()
