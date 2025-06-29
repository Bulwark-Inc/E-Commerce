from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    # Posts
    path('posts/', views.PostListCreateView.as_view(), name='post_list_create'),
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post_detail'),
    path('posts/<slug:slug>/comments/', views.PostCommentsView.as_view(), name='post_comments'),
    path('posts/<slug:slug>/rate/', views.PostRatingView.as_view(), name='post_rate'),

    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('categories/<slug:slug>/posts/', views.CategoryPostsView.as_view(), name='category_posts'),

    # Tags
    path('tags/', views.TagListView.as_view(), name='tag_list'),
    path('tags/<slug:slug>/', views.TagDetailView.as_view(), name='tag_detail'),
    path('tags/<slug:slug>/posts/', views.TagPostsView.as_view(), name='tag_posts'),

    # Special endpoints
    path('featured-posts/', views.featured_posts, name='featured_posts'),
    path('popular-posts/', views.popular_posts, name='popular_posts'),
    path('recent-posts/', views.recent_posts, name='recent_posts'),
    path('search/', views.search_posts, name='search_posts'),
    path('stats/', views.blog_stats, name='blog_stats'),
]
