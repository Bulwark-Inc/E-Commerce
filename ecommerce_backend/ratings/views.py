from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from .models import Rating
from .serializers import RatingSerializer, RatingCreateUpdateSerializer


class GenericRatingCreateUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    model = None              # Must be set in subclass
    lookup_field = 'slug'     # Can be overridden

    def get_model(self):
        assert self.model is not None, "Define `model` in subclass."
        return self.model

    def get_object(self):
        ModelClass = self.get_model()
        lookup_value = self.kwargs[self.lookup_field]
        return ModelClass.objects.get(**{self.lookup_field: lookup_value})

    def post(self, request, **kwargs):
        try:
            target = self.get_object()
        except self.get_model().DoesNotExist:
            return Response({'detail': 'Target object not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RatingCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        value = serializer.validated_data['value']

        content_type = ContentType.objects.get_for_model(target)
        rating, _ = Rating.objects.update_or_create(
            user=request.user,
            content_type=content_type,
            object_id=target.id,
            defaults={'value': value}
        )

        read_serializer = RatingSerializer(rating)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
