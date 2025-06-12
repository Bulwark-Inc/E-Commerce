from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Post, Category, Tag, Comment


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


class CommentInline(admin.TabularInline):
    model = Comment
    fields = ['author', 'content', 'is_approved', 'created_at']
    readonly_fields = ['author', 'created_at']
    extra = 0
    can_delete = True

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('author')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'featured', 
                    'views_count', 'comments_count', 'created_at', 'published_at']
    list_filter = ['status', 'featured', 'category', 'tags', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'excerpt']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'published_at', 'reading_time']
    inlines = [CommentInline]

    def comments_count(self, obj):
        return obj.comments.count()
    comments_count.short_description = 'Comments'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'short_content', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['author__username', 'post__title', 'content']
    readonly_fields = ['created_at', 'updated_at']

    def short_content(self, obj):
        return (obj.content[:50] + '...') if len(obj.content) > 50 else obj.content
    short_content.short_description = 'Content'
