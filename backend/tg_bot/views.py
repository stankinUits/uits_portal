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

User = get_user_model()


def async_process_updates(update):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        print("Создаём новый event loop")
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    asyncio.run(bot.process_new_updates([update]))


def telegram_webhook_service(update: Update):
    # thread = threading.Thread(target=async_process_updates, args=(update,))
    # thread.start()
    bot.process_new_updates([update])


# Create your views here.
@csrf_exempt
def telegram_webhook(request, secret_token):
    if request.method == 'POST':
        # Проверка секретного токена
        if secret_token != settings.TELEGRAM_BOT['WEBHOOK_SECRET']:
            return HttpResponseForbidden()

        # Обработка обновления от Telegram
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
    permission_classes = [IsTeacher]

    def post(self, request, *args, **kwargs):
        print(request.data)
        user = request.user
        event_pk = request.data['id']
        user_event = UserEvent.objects.get(pk=event_pk)
        user_event.notify(f"Напоминание от {user.last_name} {user.first_name}")
        return Response(200)
