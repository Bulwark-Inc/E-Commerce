from reviews.views import GenericReviewListCreateView
from products.models import Product

class ProductReviewView(GenericReviewListCreateView):
    model = Product
    lookup_field = 'slug'
