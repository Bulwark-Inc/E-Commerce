from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from .models import (
    Category, Product, ProductImage
)
from comments.models import Comment
from comments.serializers import CommentSerializer
from ratings.models import Rating
from ratings.mixins import AverageRatingMixin


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent']


class CategoryDetailSerializer(ProductCategorySerializer):
    children = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()

    class Meta(ProductCategorySerializer.Meta):
        fields = ProductCategorySerializer.Meta.fields + ['children', 'products_count']

    def get_children(self, obj):
        return ProductCategorySerializer(
            obj.children.filter(active=True), many=True
        ).data if obj.children.exists() else []

    def get_products_count(self, obj):
        return obj.products.filter(available=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    discount_percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'price',
            'discount_price', 'discount_percentage', 'primary_image',
            'available', 'featured'
        ]

    def get_primary_image(self, obj):
        img = obj.primary_image
        return {
            'id': img.id,
            'url': img.image.url if img.image else None,
            'alt_text': img.alt_text
        } if img else None

    def get_category_name(self, obj):
        return obj.category.name


class ProductDetailSerializer(AverageRatingMixin, serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = ProductCategorySerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    discount_percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'discount_price', 'discount_percentage',
            'stock', 'available', 'featured', 'images',
            'comments', 'average_rating',
            'created_at', 'updated_at'
        ]

    def get_comments(self, obj):
        ct = ContentType.objects.get_for_model(Product)
        qs = Comment.objects.filter(
            content_type=ct,
            object_id=obj.id,
            parent__isnull=True,
            is_approved=True
        ).select_related('author')
        return CommentSerializer(qs, many=True, context=self.context).data


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'discount_price', 'stock', 'available', 'featured'
        ]
        read_only_fields = ['id', 'slug']
