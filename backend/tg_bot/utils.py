from asyncio.log import logger
import string
import random
from threading import Thread


def generate_telegram_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=12))


def create_thread_send_message(chat_id, text):
    from tg_bot.client import bot
    # Thread(target=lambda _chat_id, _text: bot.send_message(_chat_id, _text), args=(chat_id, text)).start()
    def send_message():
        try:
            bot.send_message(chat_id, text)
        except Exception as e:
            # Обработка ошибок, чтобы понять, что не так
            logger.error(f"Failed to send message: {str(e)}")

    Thread(target=send_message).start()
