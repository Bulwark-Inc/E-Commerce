from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.urls import reverse
from django.contrib.contenttypes.models import ContentType
from ratings.models import Rating
from django.db.models import Avg

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    content = models.TextField()
    excerpt = models.TextField(
        max_length=500, blank=True,
        help_text="Brief description of the post (max 500 characters)"
    )
    meta_description = models.CharField(
        max_length=160, blank=True,
        help_text="SEO meta description (max 160 characters)"
    )
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False)
    featured_image = models.ImageField(upload_to='blog/featured/', blank=True, null=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['featured', 'status']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog:post_detail', kwargs={'slug': self.slug})

    @property
    def reading_time(self):
        word_count = len(self.content.split())
        return max(1, word_count // 200)  # 200 WPM estimate

    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])

    @property
    def average_rating(self):
        content_type = ContentType.objects.get_for_model(self)
        return Rating.objects.filter(
            content_type=content_type,
            object_id=self.id
        ).aggregate(avg=Avg('value'))['avg'] or 0

    @property
    def rating_count(self):
        content_type = ContentType.objects.get_for_model(self)
        return Rating.objects.filter(
            content_type=content_type,
            object_id=self.id
        ).count()
