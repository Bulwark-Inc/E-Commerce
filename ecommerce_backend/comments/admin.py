from django.contrib import admin
from comments.models import Comment
from django.utils.html import format_html

class ReplyInline(admin.StackedInline):
    model = Comment
    fk_name = 'parent'
    extra = 0
    fields = ['author', 'content', 'is_approved', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    show_change_link = True

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'content_type', 'object_id', 'indented_content', 'parent_display', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at', 'content_type']
    search_fields = ['author__username', 'content']
    readonly_fields = ['created_at', 'updated_at']
    list_select_related = ['author', 'parent']
    inlines = [ReplyInline]

    def indented_content(self, obj):
        indent = "&nbsp;&nbsp;&nbsp;&nbsp;" * self._get_reply_depth(obj)
        text = obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
        return format_html(f"{indent}{text}")
    indented_content.short_description = 'Content'

    def _get_reply_depth(self, obj):
        depth = 0
        parent = obj.parent
        while parent:
            depth += 1
            parent = parent.parent
        return depth

    def parent_display(self, obj):
        if obj.parent:
            return f'#{obj.parent.id} by {obj.parent.author}'
        return "-"
    parent_display.short_description = 'In Reply To'
