from django.urls import path, include
from rest_framework.routers import DefaultRouter

from products.views.base import ProductViewSet, CategoryViewSet
from products.views.comments import ProductCommentView
from products.views.ratings import ProductRatingView
from products.views.reviews import ProductReviewView
from comments.views import CommentDetailView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),

    # Comments on a product
    path('<slug:slug>/comments/', ProductCommentView.as_view(), name='product-comments'),

    # Detail/edit/delete a comment
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),

    # Rate a product (create or update)
    path('<slug:slug>/rate/', ProductRatingView.as_view(), name='product-rate'),

    # Reviews on a product
    path('<slug:slug>/reviews/', ProductReviewView.as_view(), name='product-reviews'),
]
