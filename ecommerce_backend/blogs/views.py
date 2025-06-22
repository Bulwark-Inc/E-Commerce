from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Post, Category, Tag, Comment
from .serializers import (
    PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer,
    CategorySerializer, TagSerializer, CommentSerializer, CommentCreateUpdateSerializer
)
from .permissions import IsAuthorOrReadOnly
from permissions.role_permissions import IsWriter


# === Custom Combined Permission ===
class IsWriterOrAdminCreatePermission(permissions.BasePermission):
    """
    Allow safe methods to all.
    Allow POST to writers or admin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (
            request.user.is_staff or IsWriter().has_permission(request, view)
        )


class PostListCreateView(generics.ListCreateAPIView):
    """List all published posts or create a new post (writer or admin only)"""
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
    """Retrieve, update or delete a post"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Post.objects.select_related('author', 'category').prefetch_related(
            'tags', 'comments__author', 'comments__replies__author'
        )
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
        return queryset

    def get_serializer_class(self):
        return PostCreateUpdateSerializer if self.request.method in ['PUT', 'PATCH'] else PostDetailSerializer

    def perform_update(self, serializer):
        # Allow only authors or admins to update
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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'published':
            instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


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


class PostCommentsView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(
            post__slug=self.kwargs['slug'],
            is_approved=True,
            parent__isnull=True
        ).select_related('author').prefetch_related('replies__author').order_by('created_at')

    def get_serializer_class(self):
        return CommentCreateUpdateSerializer if self.request.method == 'POST' else CommentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            post = get_object_or_404(Post, slug=self.kwargs['slug'], status='published')
            context['post'] = post
        return context


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return Comment.objects.select_related('author').prefetch_related('replies__author')

    def get_serializer_class(self):
        return CommentCreateUpdateSerializer if self.request.method in ['PUT', 'PATCH'] else CommentSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_posts(request):
    posts = Post.objects.filter(
        status='published',
        featured=True
    ).select_related('author', 'category').prefetch_related('tags')[:6]
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def popular_posts(request):
    posts = Post.objects.filter(status='published')\
        .select_related('author', 'category')\
        .prefetch_related('tags')\
        .order_by('-views_count')[:6]
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def recent_posts(request):
    posts = Post.objects.filter(status='published')\
        .select_related('author', 'category')\
        .prefetch_related('tags')\
        .order_by('-published_at')[:6]
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_posts(request):
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


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def blog_stats(request):
    stats = {
        'total_posts': Post.objects.filter(status='published').count(),
        'total_categories': Category.objects.count(),
        'total_tags': Tag.objects.count(),
        'total_comments': Comment.objects.filter(is_approved=True).count(),
    }
    return Response(stats)