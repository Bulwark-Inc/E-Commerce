from rest_framework import serializers
from .models import Comment
from django.contrib.auth import get_user_model


MAX_REPLY_DEPTH = 3 
User = get_user_model()


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'parent', 'replies', 'replies_count', 
                  'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['author', 'is_approved']

    def get_replies(self, obj):
        return CommentSerializer(
            obj.replies.filter(is_approved=True), many=True, context=self.context
        ).data

    def get_replies_count(self, obj):
        return obj.replies.filter(is_approved=True).count()


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content', 'parent']

    def validate(self, attrs):
        parent = attrs.get('parent')
        target = self.context['target_object']

        # 1. Ensure parent (if given) belongs to same content object
        if parent:
            if parent.content_type != target.get_content_type() or parent.object_id != target.id:
                raise serializers.ValidationError("Parent comment does not belong to this target object.")

            # 2. Ensure reply depth is within allowed limit
            depth = 1
            current = parent
            while current.parent:
                current = current.parent
                depth += 1
                if depth >= MAX_REPLY_DEPTH - 1:
                    raise serializers.ValidationError(f"Reply depth limit of {MAX_REPLY_DEPTH} exceeded.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        target = self.context['target_object']
        validated_data.update({
            'author': user,
            'content_object': target,
            'is_approved': user.is_staff or user.is_superuser,
        })
        return Comment.objects.create(**validated_data)