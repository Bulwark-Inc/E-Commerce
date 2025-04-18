from .prod import *

DEBUG = config('DEBUG', cast=bool, default=True)
ALLOWED_HOSTS = ['staging.medinn.africa'] # most likely ngrok for testing, I don't know
