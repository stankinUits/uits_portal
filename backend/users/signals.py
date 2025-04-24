from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import connection
from .models import User


@receiver(pre_save, sender=User)
def clear_old_teacher_connection(sender, instance, **kwargs):
    if instance.pk:  # Если это обновление существующего пользователя
        try:
            old_user = User.objects.get(pk=instance.pk)
            if old_user.teacher != instance.teacher:  # Если преподаватель изменился
                # Очищаем старую связь напрямую через SQL
                with connection.cursor() as cursor:
                    cursor.execute(
                        "UPDATE users_user SET teacher_id = NULL WHERE id = %s",
                        [instance.pk]
                    )
        except User.DoesNotExist:
            pass 