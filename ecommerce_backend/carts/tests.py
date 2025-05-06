from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Cart, CartItem, Coupon, CartCoupon
from products.models import Product, Category
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class CartAPITest(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        
        # Create test category
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        
        # Create test products
        self.product1 = Product.objects.create(
            category=self.category,
            name='Test Product 1',
            slug='test-product-1',
            price=19.99,
            stock=10,
            available=True
        )
        
        self.product2 = Product.objects.create(
            category=self.category,
            name='Test Product 2',
            slug='test-product-2',
            price=29.99,
            stock=5,
            available=True
        )
        
        # Set up API client
        self.client = APIClient()
    
    def authenticate(self):
        """Helper method to authenticate user"""
        self.client.force_authenticate(user=self.user)
    
    def test_get_empty_cart(self):
        """Test retrieving an empty cart"""
        self.authenticate()
        response = self.client.get(reverse('cart-list'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['item_count'], 0)
        self.assertEqual(response.data['total_price'], '0.00')
        self.assertEqual(len(response.data['items']), 0)
    
    def test_add_item_to_cart(self):
        """Test adding an item to the cart"""
        self.authenticate()
        
        # Add item to cart
        response = self.client.post(
            reverse('cart-items-list'),
            {
                'product_id': self.product1.id,
                'quantity': 2
            }
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check cart
        response = self.client.get(reverse('cart-list'))
        self.assertEqual(response.data['item_count'], 2)
        self.assertEqual(response.data['total_price'], '39.98')  # 19.99 * 2
        self.assertEqual(len(response.data['items']), 1)
    
    def test_update_cart_item(self):
        """Test updating a cart item's quantity"""
        self.authenticate()
        
        # Add item to cart
        response = self.client.post(
            reverse('cart-items-list'),
            {
                'product_id': self.product1.id,
                'quantity': 1
            }
        )
        
        item_id = response.data['id']
        
        # Update quantity
        response = self.client.patch(
            reverse('cart-items-detail', args=[item_id]),
            {
                'quantity': 3
            }
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check cart
        response = self.client.get(reverse('cart-list'))
        self.assertEqual(response.data['item_count'], 3)
        self.assertEqual(response.data['total_price'], '59.97')  # 19.99 * 3
    
    def test_remove_cart_item(self):
        """Test removing an item from the cart"""
        self.authenticate()
        
        # Add item to cart
        response = self.client.post(
            reverse('cart-items-list'),
            {
                'product_id': self.product1.id,
                'quantity': 2
            }
        )
        
        item_id = response.data['id']
        
        # Set quantity to 0 to remove
        response = self.client.patch(
            reverse('cart-items-detail', args=[item_id]),
            {
                'quantity': 0
            }
        )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Check cart
        response = self.client.get(reverse('cart-list'))
        self.assertEqual(response.data['item_count'], 0)
        self.assertEqual(len(response.data['items']), 0)
    
    def test_clear_cart(self):
        """Test clearing the entire cart"""
        self.authenticate()
        
        # Add items to cart
        self.client.post(
            reverse('cart-items-list'),
            {
                'product_id': self.product1.id,
                'quantity': 2
            }
        )
        
        self.client.post(
            reverse('cart-items-list'),
            {
                'product_id': self.product2.id,
                'quantity': 1
            }
        )
        
        # Clear cart
        response = self.client.post(reverse('cart-clear'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check cart
        response = self.client.get(reverse('cart-list'))
        self.assertEqual(response.data['item_count'], 0)
        self.assertEqual(len(response.data['items']), 0)
    
    def test_apply_coupon(self):
        """Test applying a valid coupon to the cart"""
        self.authenticate()
        
        # Create a valid coupon
        now = timezone.now()
        coupon = Coupon.objects.create(
            code='TEST20',
            discount_percentage=20,
            valid_from=now - timedelta(days=1),
            valid_to=now + timedelta(days=1),
            active=True
        )
        
        # Add item to cart
        self.client.post(
            reverse('cart-items-list'),
            {
                'product_id': self.product1.id,
                'quantity': 2
            }
        )
        
        # Apply coupon
        response = self.client.post(
            reverse('cart-apply-coupon'),
            {
                'coupon_code': 'TEST20'
            }
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['discount_value'], '8.00')  # 20% of 39.98
        self.assertEqual(response.data['final_total'], '31.98')  # 39.98 - 8.00
        
        # Remove coupon
        response = self.client.delete(reverse('cart-remove-coupon'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)