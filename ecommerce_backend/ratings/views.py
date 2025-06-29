from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType

from .models import Rating
from .serializers import RatingSerializer


class GenericRatingCreateUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_model(self):
        raise NotImplementedError("You must implement get_model() in your subclass.")

    def post(self, request, slug):
        ModelClass = self.get_model()

        try:
            obj = ModelClass.objects.get(slug=slug, status='published')
        except ModelClass.DoesNotExist:
            return Response({'detail': 'Object not found.'}, status=status.HTTP_404_NOT_FOUND)

        value = request.data.get('value')
        if value is None:
            return Response({'detail': 'Rating value is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            value = int(value)
            if value < 1 or value > 5:
                raise ValueError()
        except ValueError:
            return Response({'detail': 'Rating must be an integer between 1 and 5.'}, status=status.HTTP_400_BAD_REQUEST)

        content_type = ContentType.objects.get_for_model(obj)
        rating, _ = Rating.objects.update_or_create(
            content_type=content_type,
            object_id=obj.id,
            user=request.user,
            defaults={'value': value}
        )

        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
