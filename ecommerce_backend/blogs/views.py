from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from .models import Post, Category, Tag, Comment
from .serializers import (
    PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer,
    CategorySerializer, TagSerializer, CommentSerializer, CommentCreateUpdateSerializer
)
from .permissions import IsAdminOrReadOnly, IsAuthorOrReadOnly


class PostListCreateView(generics.ListCreateAPIView):
    """List all published posts or create a new post (admin only)"""
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'featured']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        queryset = Post.objects.select_related('author', 'category').prefetch_related('tags')
        
        # For non-admin users, only show published posts
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
        
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer
        return PostListSerializer


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a post"""
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Post.objects.select_related('author', 'category').prefetch_related(
            'tags', 'comments__author', 'comments__replies__author'
        )
        
        # For non-admin users, only show published posts
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
        
        return queryset

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateUpdateSerializer
        return PostDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count for published posts
        if instance.status == 'published':
            instance.increment_views()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CategoryListView(generics.ListAPIView):
    """List all categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    """Retrieve category details with posts"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class CategoryPostsView(generics.ListAPIView):
    """List posts by category"""
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        category_slug = self.kwargs['slug']
        return Post.objects.filter(
            category__slug=category_slug,
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')


class TagListView(generics.ListAPIView):
    """List all tags"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]


class TagDetailView(generics.RetrieveAPIView):
    """Retrieve tag details"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class TagPostsView(generics.ListAPIView):
    """List posts by tag"""
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        tag_slug = self.kwargs['slug']
        return Post.objects.filter(
            tags__slug=tag_slug,
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')


class PostCommentsView(generics.ListCreateAPIView):
    """List comments for a post or create a new comment"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_slug = self.kwargs['slug']
        return Comment.objects.filter(
            post__slug=post_slug,
            is_approved=True,
            parent__isnull=True  # Only top-level comments
        ).select_related('author').prefetch_related('replies__author').order_by('created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateUpdateSerializer
        return CommentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            post_slug = self.kwargs['slug']
            context['post'] = get_object_or_404(Post, slug=post_slug, status='published')
        return context


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a comment"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        return Comment.objects.select_related('author').prefetch_related('replies__author')

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CommentCreateUpdateSerializer
        return CommentSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_posts(request):
    """Get featured posts"""
    posts = Post.objects.filter(
        status='published',
        featured=True
    ).select_related('author', 'category').prefetch_related('tags')[:6]
    
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def popular_posts(request):
    """Get popular posts based on view count"""
    posts = Post.objects.filter(
        status='published'
    ).select_related('author', 'category').prefetch_related('tags').order_by('-views_count')[:6]
    
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def recent_posts(request):
    """Get recent posts"""
    posts = Post.objects.filter(
        status='published'
    ).select_related('author', 'category').prefetch_related('tags').order_by('-published_at')[:6]
    
    serializer = PostListSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_posts(request):
    """Search posts"""
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
    """Get blog statistics"""
    stats = {
        'total_posts': Post.objects.filter(status='published').count(),
        'total_categories': Category.objects.count(),
        'total_tags': Tag.objects.count(),
        'total_comments': Comment.objects.filter(is_approved=True).count(),
    }
    return Response(stats)