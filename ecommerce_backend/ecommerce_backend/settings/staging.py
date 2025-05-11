from .base import *
from .base import BASE_DIR
from decouple import config

# Django settings
DEBUG = config('DEBUG', cast=bool, default=False)
ALLOWED_HOSTS = ['54.196.149.31', 'medinn.duckdns.org']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    "https://medinn.duckdns.org"
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://medinn-virid.vercel.app",
    'https://medinn.duckdns.org',
]

CORS_TRUSTED_ORIGINS = [
    "https://medinn-virid.vercel.app",
    'https://medinn.duckdns.org',
]

# SSL Settings
SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
