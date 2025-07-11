from rest_framework import generics, permissions
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer

class GenericCommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    model = None              # Consumer app must set this
    lookup_field = 'slug'     # Can be overridden per model

    def get_queryset(self):
        target = self.get_target_object()
        content_type = ContentType.objects.get_for_model(target.__class__)
        return Comment.objects.filter(
            content_type=content_type,
            object_id=target.id,
            parent__isnull=True,
            is_approved=True
        ).select_related('author').prefetch_related('replies__author')

    def get_target_object(self):
        assert self.model is not None, "Define `model` in subclass"
        return get_object_or_404(self.model, **{self.lookup_field: self.kwargs[self.lookup_field]})

    def get_serializer_class(self):
        return CommentCreateSerializer if self.request.method == 'POST' else CommentSerializer

    def get_serializer_context(self):
        return {
            'request': self.request,
            'target_object': self.get_target_object()
        }


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.select_related('author').prefetch_related('replies__author')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer

    def perform_update(self, serializer):
        comment = self.get_object()
        if comment.author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own comment.")
        serializer.save(author=comment.author, content_type=comment.content_type, object_id=comment.object_id)

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own comment.")
        instance.delete()