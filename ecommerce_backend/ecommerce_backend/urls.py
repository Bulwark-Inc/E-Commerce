from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap

from blogs.sitemaps import PostSitemap

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

    # accomodation and logistics
    # path('api/v1/housing/', include('housing.urls')),

    # admin
    # path('api/v1/dashboard/', include('dashboard.urls')),

    # others
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)