from rest_framework import serializers
from .models import Review, ReviewImage


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    images = ReviewImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'rating', 'pros', 'cons', 'comment',
            'images', 'uploaded_images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'images', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5 stars.")
        return value

    def create(self, validated_data):
        images = validated_data.pop('uploaded_images', [])
        review = Review.objects.create(user=self.context['request'].user, **validated_data)

        for img in images:
            ReviewImage.objects.create(review=review, image=img)

        return review

    def update(self, instance, validated_data):
        images = validated_data.pop('uploaded_images', None)
        instance = super().update(instance, validated_data)

        if images:
            # Clear old images or keep them depending on your business logic
            ReviewImage.objects.filter(review=instance).delete()
            for img in images:
                ReviewImage.objects.create(review=instance, image=img)

        return instance
