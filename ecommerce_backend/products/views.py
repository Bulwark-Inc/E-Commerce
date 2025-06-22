from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from permissions.role_permissions import IsProductManager
from .models import Category, Product, ProductImage, ProductReview
from .serializers import (
    CategorySerializer, CategoryDetailSerializer,
    ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, ProductImageSerializer,
    ProductReviewSerializer
)
from .filters import ProductFilter


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(active=True)
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsProductManager()]
        return [permissions.AllowAny()]
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        category = self.get_object()
        products = Product.objects.filter(
            Q(category=category) | Q(category__parent=category),
            available=True
        )
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(available=True)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsProductManager()]
        return [permissions.AllowAny()]
    
    @action(detail=True, methods=['post'])
    def add_image(self, request, slug=None):
        product = self.get_object()
        serializer = ProductImageSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, slug=None):
        product = self.get_object()
        user = request.user

        if user.is_staff:
            return Response({"detail": "Staff cannot review products."}, status=status.HTTP_403_FORBIDDEN)

        if ProductReview.objects.filter(product=product, user=user).exists():
            return Response(
                {"detail": "You have already reviewed this product."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ProductReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = Product.objects.filter(featured=True, available=True)
        page = self.paginate_queryset(featured_products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductListSerializer(featured_products[:8], many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def related(self, request):
        product_id = request.query_params.get('product_id')
        category_id = request.query_params.get('category_id')
        
        try:
            product_id = int(product_id)
            category_id = int(category_id)
        except (TypeError, ValueError):
            return Response(
                {"detail": "Valid product_id and category_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        related_products = Product.objects.filter(
            category_id=category_id, 
            available=True
        ).exclude(id=product_id)

        page = self.paginate_queryset(related_products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductListSerializer(related_products[:6], many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
