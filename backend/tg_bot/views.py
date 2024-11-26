import asyncio
import threading

import telebot
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import permissions
from rest_framework.response import Response
from telebot.types import Update
from rest_framework.exceptions import PermissionDenied

from events.models import UserEvent
from tg_bot.client import bot
from rest_framework.generics import DestroyAPIView, GenericAPIView

from tg_bot.models import TelegramUser
from tg_bot.serializers import TelegramUserSerializer
from users.permissions import IsTeacher
from django.shortcuts import get_object_or_404
import logging

User = get_user_model()

logger = logging.getLogger(__name__)

def async_process_updates(update):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        logger.info("Создаём новый event loop")
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    asyncio.run(bot.process_new_updates([update]))


def telegram_webhook_service(update: Update):
    # thread = threading.Thread(target=async_process_updates, args=(update,))
    # thread.start()
    bot.process_new_updates([update])


# Create your views here.
@csrf_exempt
def telegram_webhook(request):
    if request.method == 'POST':
        logger.info("Received update from Telegram!")
        update_json_string = request.body.decode('utf-8')
        update = telebot.types.Update.de_json(update_json_string)
        threading.Thread(target=telegram_webhook_service, args=(update,)).start()
        return JsonResponse({"status": "ok"})
    return JsonResponse({'status': 'error'})


class TelegramUserDestroyAPIView(DestroyAPIView):
    queryset = TelegramUser.objects.all()
    serializer_class = TelegramUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user
        if user.id != instance.assigned_user_id:
            raise PermissionDenied()
        instance.delete()


class UserEventsNotificationsAPIView(GenericAPIView):

    def post(self, request, *args, **kwargs):
        logger.info("Received request for sending notifications.")
        logger.debug(f"Request data: {request.data}")

        # Получение пользователя и идентификатора события
        user = request.user
        event_pk = request.data.get('id')
        if not event_pk:
            return Response({"error": "Event ID is required."}, status=400)

        # Получение объекта события
        user_event = get_object_or_404(UserEvent, pk=event_pk)

        # Отправка уведомления
        notification_message = f"Напоминание от {user.last_name} {user.first_name}"
        user_event.notify(notification_message)

        logger.info(f"Notification sent for event ID {event_pk} by user {user.id}")
        return Response({"status": "Notification sent successfully."}, status=200)
