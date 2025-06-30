from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap

from blogs.sitemaps import PostSitemap

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)

sitemaps = {
    'posts': PostSitemap,
}


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # core user management
    path('api/v1/account/', include('accounts.urls')),
    path('api/v1/profile/', include('profiles.urls')),
    path('api/v1/permissions/', include('permissions.urls')),

    # commerce domain
    path('api/v1/products/', include('products.urls')),
    path('api/v1/cart/', include('carts.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/payment/', include('payments.urls')),

    # content and engagement
    path('api/v1/blogs/', include('blogs.urls')),
    path('api/v1/comments/', include('comments.urls')),
    path('api/v1/ratings/', include('ratings.urls')),
    path('api/v1/notifications/', include('notifications.urls')),

    # accomodation and logistics
    path('api/v1/housing/', include('housing.urls')),
    path('api/v1/applications/', include('applications.urls')),
    path('api/v1/reviews/', include('reviews.urls')),
    # path('api/v1/maps/', include('maps.urls')),

    # admin
    # path('api/v1/dashboard/', include('dashboard.urls')),

    # others
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),

    # DRF_Spectacular
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'), # JSON schema
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'), # Swagger UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'), # Redoc UI (optional)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)