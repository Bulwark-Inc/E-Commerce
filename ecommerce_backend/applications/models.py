from django.db import models
from django.conf import settings
from housing.models import Housing


class ApplicationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    ACCEPTED = 'accepted', 'Accepted'
    REJECTED = 'rejected', 'Rejected'
    CANCELLED = 'cancelled', 'Cancelled'


class Application(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='housing_applications')
    housing = models.ForeignKey(Housing, on_delete=models.CASCADE, related_name='applications')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=ApplicationStatus.choices, default=ApplicationStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'housing')

    def __str__(self):
        return f"{self.user.email} → {self.housing.title} ({self.status})"
