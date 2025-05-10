from .base import *
from .base import BASE_DIR
from decouple import config

# Django settings
DEBUG = config('DEBUG', cast=bool, default=False)
ALLOWED_HOSTS = ['*']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True