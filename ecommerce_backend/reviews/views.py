from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404

from .models import Review
from .serializers import ReviewSerializer


class GenericReviewListCreateView(ListCreateAPIView):
    """
    Reusable review endpoint for any model.
    Subclass and define `model` and optionally `lookup_field`.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    model = None
    lookup_field = 'pk'

    def get_model(self):
        assert self.model is not None, "Define `model` in subclass."
        return self.model

    def get_object(self):
        ModelClass = self.get_model()
        return get_object_or_404(ModelClass, **{self.lookup_field: self.kwargs[self.lookup_field]})

    def get_queryset(self):
        target = self.get_object()
        content_type = ContentType.objects.get_for_model(target)
        return Review.objects.filter(
            content_type=content_type,
            object_id=target.id,
            is_active=True
        ).select_related('user').prefetch_related('images')

    def perform_create(self, serializer):
        target = self.get_object()
        content_type = ContentType.objects.get_for_model(target)

        serializer.save(
            user=self.request.user,
            content_type=content_type,
            object_id=target.id
        )


class ReviewDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.select_related('user').prefetch_related('images')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        review = self.get_object()
        if review.user != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own review.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own review.")
        instance.is_active = False
        instance.save()
