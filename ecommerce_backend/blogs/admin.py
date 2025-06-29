from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Post, Category, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'posts_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']

    def posts_count(self, obj):
        count = obj.posts.count()
        if count > 0:
            url = reverse('admin:blog_post_changelist') + f'?category__id__exact={obj.id}'
            return format_html('<a href="{}">{} posts</a>', url, count)
        return '0 posts'
    posts_count.short_description = 'Posts Count'


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'posts_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']

    def posts_count(self, obj):
        count = obj.posts.count()
        if count > 0:
            url = reverse('admin:blog_post_changelist') + f'?tags__id__exact={obj.id}'
            return format_html('<a href="{}">{} posts</a>', url, count)
        return '0 posts'
    posts_count.short_description = 'Posts Count'


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'featured', 
                    'views_count', 'comments_count', 'created_at', 'published_at']
    list_filter = ['status', 'featured', 'category', 'tags', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'excerpt']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'published_at', 'reading_time']

    def comments_count(self, obj):
        from comments.models import Comment
        from django.contrib.contenttypes.models import ContentType

        post_type = ContentType.objects.get_for_model(obj.__class__)
        return Comment.objects.filter(content_type=post_type, object_id=obj.pk).count()
    comments_count.short_description = 'Comments'
