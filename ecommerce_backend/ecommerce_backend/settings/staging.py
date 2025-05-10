from .base import *
from .base import BASE_DIR
from decouple import config

# Django settings
DEBUG = config('DEBUG', cast=bool, default=False)
ALLOWED_HOSTS = ['http://54.196.149.31']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://medinn-virid.vercel.app",
]

CORS_TRUSTED_ORIGINS = [
    "https://medinn-virid.vercel.app",
]