from rest_framework import serializers
from .models import Comment
from django.contrib.auth import get_user_model

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

    def create(self, validated_data):
        user = self.context['request'].user
        target = self.context['target_object']
        validated_data.update({
            'author': user,
            'content_object': target,
        })
        return Comment.objects.create(**validated_data)
