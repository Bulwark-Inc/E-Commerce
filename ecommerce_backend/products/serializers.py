from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductReview


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent']


class CategoryDetailSerializer(CategorySerializer):
    children = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    
    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + ['children', 'products_count']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(active=True), many=True).data
        return []
    
    def get_products_count(self, obj):
        return obj.products.filter(available=True).count()


class ProductReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductReview
        fields = ['id', 'username', 'rating', 'comment', 'created_at']
    
    def get_username(self, obj):
        return obj.user.username


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
        image = obj.primary_image
        if image:
            return {
                'id': image.id,
                'url': image.image.url if image.image else None,
                'alt_text': image.alt_text
            }
        return None
    
    def get_category_name(self, obj):
        return obj.category.name


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    discount_percentage = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'discount_price', 'discount_percentage',
            'stock', 'available', 'featured', 'images',
            'reviews', 'average_rating', 'created_at', 'updated_at'
        ]
    
    def get_average_rating(self, obj):
        if obj.reviews.exists():
            return round(sum(review.rating for review in obj.reviews.all()) / obj.reviews.count(), 1)
        return None


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price', 'discount_price', 'stock', 'available', 'featured'
        ]
        read_only_fields = ['id', 'slug']