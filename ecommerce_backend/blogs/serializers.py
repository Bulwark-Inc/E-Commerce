from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Category, Tag
from comments.models import Comment
from comments.serializers import CommentSerializer
from ratings.models import Rating

User = get_user_model()


class AuthorSerializer(serializers.ModelSerializer):
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


class PostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    reading_time = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'author', 'excerpt', 'category', 'tags',
            'featured', 'featured_image', 'comments_count', 'views_count',
            'average_rating', 'rating_count', 'reading_time',
            'created_at', 'updated_at', 'published_at'
        ]

    def get_comments_count(self, obj):
        from django.contrib.contenttypes.models import ContentType
        post_type = ContentType.objects.get_for_model(Post)
        return Comment.objects.filter(content_type=post_type, object_id=obj.id, is_approved=True).count()


class PostDetailSerializer(PostListSerializer):
    comments = serializers.SerializerMethodField()

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ['content', 'meta_description', 'comments']

    def get_comments(self, obj):
        from django.contrib.contenttypes.models import ContentType
        post_type = ContentType.objects.get_for_model(Post)
        top_level_comments = Comment.objects.filter(
            content_type=post_type,
            object_id=obj.id,
            is_approved=True,
            parent__isnull=True
        ).select_related('author').prefetch_related('replies__author').order_by('created_at')
        return CommentSerializer(top_level_comments, many=True, context=self.context).data


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'excerpt', 'meta_description',
            'category_id', 'tag_ids', 'status', 'featured', 'featured_image'
        ]

    def validate_category_id(self, value):
        if value and not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError("Category does not exist.")
        return value

    def validate_tag_ids(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Must be a list of tag IDs.")
        existing = Tag.objects.filter(id__in=value).count()
        if existing != len(value):
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
            instance.category = Category.objects.get(id=category_id) if category_id else None

        if tag_ids is not None:
            instance.tags.set(Tag.objects.filter(id__in=tag_ids))

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        return PostDetailSerializer(instance, context=self.context).data
