from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Category, Tag, Comment

User = get_user_model()


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for post authors"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'posts_count', 'created_at']

    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'posts_count']

    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'parent', 'replies', 'replies_count', 
                 'is_approved', 'created_at', 'updated_at']
        read_only_fields = ['author', 'is_approved', 'created_at', 'updated_at']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(
                obj.replies.filter(is_approved=True), 
                many=True, 
                context=self.context
            ).data
        return []

    def get_replies_count(self, obj):
        return obj.replies.filter(is_approved=True).count()

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class PostListSerializer(serializers.ModelSerializer):
    """Serializer for post list view"""
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    reading_time = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'author', 'excerpt', 'category', 'tags',
                 'featured', 'featured_image', 'comments_count', 'views_count',
                 'reading_time', 'created_at', 'updated_at', 'published_at']

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class PostDetailSerializer(serializers.ModelSerializer):
    """Serializer for post detail view"""
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    reading_time = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'author', 'content', 'excerpt', 
                 'meta_description', 'category', 'tags', 'featured', 'featured_image',
                 'comments', 'comments_count', 'views_count', 'reading_time',
                 'created_at', 'updated_at', 'published_at']

    def get_comments(self, obj):
        # Only get top-level comments (not replies)
        top_level_comments = obj.comments.filter(
            is_approved=True, 
            parent__isnull=True
        ).order_by('created_at')
        return CommentSerializer(top_level_comments, many=True, context=self.context).data

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating posts (admin only)"""
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'excerpt', 'meta_description', 
                 'category_id', 'tag_ids', 'status', 'featured', 'featured_image']

    def validate_category_id(self, value):
        if value is not None:
            if not Category.objects.filter(id=value).exists():
                raise serializers.ValidationError("Category does not exist.")
        return value

    def validate_tag_ids(self, value):
        if value:
            existing_tags = Tag.objects.filter(id__in=value).count()
            if existing_tags != len(value):
                raise serializers.ValidationError("One or more tags do not exist.")
        return value

    def create(self, validated_data):
        category_id = validated_data.pop('category_id', None)
        tag_ids = validated_data.pop('tag_ids', [])
        
        validated_data['author'] = self.context['request'].user
        
        if category_id:
            validated_data['category'] = Category.objects.get(id=category_id)
        
        post = Post.objects.create(**validated_data)
        
        if tag_ids:
            post.tags.set(Tag.objects.filter(id__in=tag_ids))
        
        return post

    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        tag_ids = validated_data.pop('tag_ids', None)
        
        if category_id is not None:
            if category_id:
                instance.category = Category.objects.get(id=category_id)
            else:
                instance.category = None
        
        if tag_ids is not None:
            instance.tags.set(Tag.objects.filter(id__in=tag_ids))
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    def to_representation(self, instance):
        # Return the detailed representation after create/update
        return PostDetailSerializer(instance, context=self.context).data


class CommentCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating comments"""
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'parent']

    def validate_parent(self, value):
        if value and value.post != self.context.get('post'):
            raise serializers.ValidationError(
                "Parent comment must belong to the same post."
            )
        return value

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        validated_data['post'] = self.context['post']
        return super().create(validated_data)

    def to_representation(self, instance):
        return CommentSerializer(instance, context=self.context).data