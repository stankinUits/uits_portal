"""
Django settings for uits project.

Generated by 'django-admin startproject' using Django 4.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
# Load db environment variables
environ.Env.read_env(BASE_DIR / os.environ.get('DB_ENVIRONMENT_FILE', 'db.local.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-95rc)10zgr)+px@hl=h_5*3h3ab6rmt3esf@p#gw(ez^+7m9%*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Third party apps

THIRD_INSTALLED_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'imagekit',
    'django_quill'
]

# Local application definition

LOCAL_INSTALLED_APPS = [
    'users.apps.UsersConfig',
    'department.news.apps.NewsConfig',
    'department.employee',
    'department.employee.schedule'
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    *THIRD_INSTALLED_APPS,
    *LOCAL_INSTALLED_APPS
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'uits.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'uits.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB'),
        'USER': env('POSTGRES_USER'),
        'PASSWORD': env('POSTGRES_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'client_encoding': 'UTF8'
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'static'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

REST_AUTH = {
    'USER_DETAILS_SERIALIZER': 'users.serializers.UserDetailsSerializer'
}

MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

QUILL_CONFIGS = {
    'default': {
        'theme': 'snow',
        'modules': {
            'syntax': True,  # Включает подсветку синтаксиса, требует подключения Highlight.js
            'toolbar': [
                ['bold', 'italic', 'underline', 'strike'],  # жирный, курсив, подчеркнутый, зачеркнутый
                ['blockquote', 'code-block'],  # блок цитирования, блок кода

                [{'header': 1}, {'header': 2}],  # Заголовки разного уровня
                [{'list': 'ordered'}, {'list': 'bullet'}],  # Нумерованный и маркированный списки
                [{'script': 'sub'}, {'script': 'super'}],  # Нижний и верхний индексы
                [{'indent': '-1'}, {'indent': '+1'}],  # Изменение отступа
                [{'direction': 'rtl'}],  # Направление текста справа налево

                [{'size': ['small', False, 'large', 'huge']}],  # Размер текста
                [{'header': [1, 2, 3, 4, 5, 6, False]}],  # Заголовки

                [{'color': []}, {'background': []}],  # Выбор цвета текста и фона
                [{'font': []}],  # Выбор шрифта
                [{'align': []}],  # Выравнивание текста

                ['link', 'image', 'video', 'formula'],  # Вставка ссылок, изображений, видео, формул
                ['clean']  # Удаление форматирования
            ],
            "imageCompressor": {
                "quality": 0.8,
                "maxWidth": 2000,
                "maxHeight": 2000,
                "imageType": "image/jpeg",
                "debug": False,
                "suppressErrorLogging": True,
            },
            # quill-resize
            "resize": {
                "showSize": True,
                "locale": {},
            },
        }
    }
}
