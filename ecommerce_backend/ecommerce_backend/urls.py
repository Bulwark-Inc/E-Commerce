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
    path('api/v1/user/', include('users.urls')),
    path('api/v1/products/', include('products.urls')),
    path('api/v1/cart/', include('carts.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/blogs/', include('blogs.urls')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)