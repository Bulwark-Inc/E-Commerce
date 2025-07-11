from ratings.views import GenericRatingCreateUpdateView
from products.models import Product

class ProductRatingView(GenericRatingCreateUpdateView):
    model = Product
    lookup_field = 'slug'
