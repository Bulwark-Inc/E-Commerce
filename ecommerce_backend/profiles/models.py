from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='profile', on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # Role intent flags
    wants_to_be_writer = models.BooleanField(default=False)
    wants_to_be_host = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email}'s profile"


class Address(models.Model):
    ADDRESS_TYPE_CHOICES = (
        ('billing', 'Billing'),
        ('shipping', 'Shipping'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='addresses', on_delete=models.CASCADE)
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES)
    default = models.BooleanField(default=False)
    full_name = models.CharField(max_length=100)
    address_line1 = models.CharField(max_length=100)
    address_line2 = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)

    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.user.email}'s {self.address_type} address"
