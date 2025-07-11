from rest_framework import serializers
from .models import Housing
from comments.serializers import CommentSerializer
from ratings.mixins import AverageRatingMixin


class HousingSerializer(AverageRatingMixin, serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    comments_preview = serializers.SerializerMethodField()

    class Meta:
        model = Housing
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

    def get_comments_preview(self, obj):
        root_comments = obj.comments.filter(parent__isnull=True, is_approved=True).order_by('-created_at')[:3]
        return CommentSerializer(root_comments, many=True, context=self.context).data