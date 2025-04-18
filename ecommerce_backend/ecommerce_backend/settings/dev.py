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
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",  # Vite frontend
    "http://localhost:5173",  # Vite frontend
]