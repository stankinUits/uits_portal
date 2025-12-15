from uits.settings import CELERY_BROKER_URL


broker_url = CELERY_BROKER_URL
port = "5555"

logging = "info"

persistent = True

state_save_interval = 10

# basic_auth = [f"{os.environ.get('FLOWER_LOGIN')}:{os.environ.get('FLOWER_PASSWORD')}"]
# url_prefix = os.environ.get("FLOWER_PREFIX")

# py_logging.getLogger("flower.events").setLevel(py_logging.INFO)

# db = '/data/flower.db'
# Уведомления (например, если хотите Telegram-бота)
# flower_events = True