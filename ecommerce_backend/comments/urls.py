from django.urls import path
from .views import GenericCommentListCreateView, CommentDetailView

urlpatterns = [
    # GET comments on a post / Add new comment
    path('<slug:slug>/comments/', GenericCommentListCreateView.as_view(), name='comment-list-create'),

    # Get / Edit / Delete individual comment
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
