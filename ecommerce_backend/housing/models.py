from django.db import models
from django.conf import settings


class PropertyType(models.TextChoices):
    HOSTEL = 'hostel', 'Hostel'
    APARTMENT = 'apartment', 'Apartment'
    SHARED = 'shared', 'Shared Room'
    PRIVATE = 'private', 'Private Room'


class Housing(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    is_available = models.BooleanField(default=True)

    image = models.ImageField(upload_to='housing/', null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='housing_listings'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.city}"
