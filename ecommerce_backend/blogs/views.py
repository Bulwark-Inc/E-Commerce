from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from django.contrib.contenttypes.models import ContentType

from .models import Post, Category, Tag
from .serializers import (
    PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer,
    CategorySerializer, TagSerializer
)
from .permissions import IsAuthorOrReadOnly
from permissions.role_permissions import IsWriter

# Comments integration
from comments.views import GenericCommentListCreateView
from comments.models import Comment

# Ratings integration
from ratings.views import GenericRatingCreateUpdateView
from ratings.models import Rating


class IsWriterOrAdminCreatePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (
            request.user.is_staff or IsWriter().has_permission(request, view)
        )


class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsWriterOrAdminCreatePermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'featured']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        queryset = Post.objects.select_related('author', 'category').prefetch_related('tags')
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
        return queryset

    def get_serializer_class(self):
        return PostCreateUpdateSerializer if self.request.method == 'POST' else PostListSerializer


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Post.objects.select_related('author', 'category').prefetch_related('tags')
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
        return queryset

    def get_serializer_class(self):
        return PostCreateUpdateSerializer if self.request.method in ['PUT', 'PATCH'] else PostDetailSerializer

    def perform_update(self, serializer):
        instance = self.get_object()
        user = self.request.user
        if instance.author != user and not user.is_staff:
            raise permissions.PermissionDenied("You don't have permission to update this post.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.author != user and not user.is_staff:
            raise permissions.PermissionDenied("You don't have permission to delete this post.")
        instance.delete()

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        if instance.status == 'published':
            instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# COMMENTS: Generic comment view for Post
class PostCommentsView(GenericCommentListCreateView):
    def get_model(self):
        from .models import Post
        return Post


# RATINGS: Generic rating view for Post
class PostRatingView(GenericRatingCreateUpdateView):
    def get_model(self):
        from .models import Post
        return Post


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class CategoryPostsView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        return Post.objects.filter(
            category__slug=self.kwargs['slug'],
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]


class TagDetailView(generics.RetrieveAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class TagPostsView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        return Post.objects.filter(
            tags__slug=self.kwargs['slug'],
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')


@extend_schema(responses=PostListSerializer(many=True))
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_posts(request: Request) -> Response:
    posts = Post.objects.filter(status='published', featured=True)\
        .select_related('author', 'category').prefetch_related('tags')[:6]
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@extend_schema(responses=PostListSerializer(many=True))
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def popular_posts(request: Request) -> Response:
    posts = Post.objects.filter(status='published')\
        .select_related('author', 'category')\
        .prefetch_related('tags')\
        .order_by('-views_count')[:6]
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@extend_schema(responses=PostListSerializer(many=True))
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def recent_posts(request: Request) -> Response:
    posts = Post.objects.filter(status='published')\
        .select_related('author', 'category')\
        .prefetch_related('tags')\
        .order_by('-published_at')[:6]
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@extend_schema(responses={'results': PostListSerializer(many=True)})
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_posts(request: Request) -> Response:
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})
    posts = Post.objects.filter(
        Q(title__icontains=query) |
        Q(content__icontains=query) |
        Q(excerpt__icontains=query) |
        Q(tags__name__icontains=query),
        status='published'
    ).select_related('author', 'category').prefetch_related('tags').distinct()
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response({'results': serializer.data})


@extend_schema(responses=dict)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def blog_stats(request: Request) -> Response:
    post_type = ContentType.objects.get_for_model(Post)
    stats = {
        'total_posts': Post.objects.filter(status='published').count(),
        'total_categories': Category.objects.count(),
        'total_tags': Tag.objects.count(),
        'total_comments': Comment.objects.filter(content_type=post_type, is_approved=True).count(),
        'total_ratings': Rating.objects.filter(content_type=post_type).count(),
    }
    return Response(stats)
