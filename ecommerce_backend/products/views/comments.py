from comments.views import GenericCommentListCreateView
from products.models import Product

class ProductCommentView(GenericCommentListCreateView):
    model = Product
    lookup_field = 'slug'
