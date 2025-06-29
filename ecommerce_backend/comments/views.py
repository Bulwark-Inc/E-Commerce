from rest_framework import generics, permissions
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer

class GenericCommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        model = self.get_model()
        obj = get_object_or_404(model, slug=self.kwargs['slug'])
        content_type = ContentType.objects.get_for_model(model)
        return Comment.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            parent__isnull=True,
            is_approved=True
        ).select_related('author').prefetch_related('replies__author')

    def get_model(self):
        from blogs.models import Post  # example; inject this for reusability
        return Post

    def get_serializer_class(self):
        return CommentCreateSerializer if self.request.method == 'POST' else CommentSerializer

    def get_serializer_context(self):
        model = self.get_model()
        target = get_object_or_404(model, slug=self.kwargs['slug'])
        return {'request': self.request, 'target_object': target}


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.select_related('author').prefetch_related('replies__author')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer

    def perform_update(self, serializer):
        if self.get_object().author != self.request.user:
            raise permissions.PermissionDenied("Not your comment.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("Not your comment.")
        instance.delete()
