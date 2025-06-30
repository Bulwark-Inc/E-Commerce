from rest_framework.generics import ListCreateAPIView
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404

from .models import Review
from .serializers import ReviewSerializer

from rest_framework.generics import RetrieveUpdateDestroyAPIView


class GenericReviewListCreateView(ListCreateAPIView):
    """
    Reusable review endpoint for any model.
    Subclass and define get_model().
    """
    serializer_class = ReviewSerializer

    def get_model(self):
        raise NotImplementedError("Subclasses must implement `get_model()`.")

    def get_object_id(self):
        return self.kwargs['pk']

    def get_queryset(self):
        model = self.get_model()
        obj = get_object_or_404(model, pk=self.get_object_id())
        content_type = ContentType.objects.get_for_model(model)
        return Review.objects.filter(
            content_type=content_type,
            object_id=obj.pk,
            is_active=True
        )

    def perform_create(self, serializer):
        model = self.get_model()
        obj = get_object_or_404(model, pk=self.get_object_id())
        content_type = ContentType.objects.get_for_model(model)

        serializer.save(
            user=self.request.user,
            content_type=content_type,
            object_id=obj.pk
        )


class ReviewDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer