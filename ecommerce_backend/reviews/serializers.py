from rest_framework import serializers
from .models import Review, ReviewImage

class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ['id', 'image']

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
            'images', 'uploaded_images', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'images', 'created_at']

    def create(self, validated_data):
        images = validated_data.pop('uploaded_images', [])
        review = Review.objects.create(user=self.context['request'].user, **validated_data)

        for img in images:
            ReviewImage.objects.create(review=review, image=img)

        return review
