from django.urls import path
from .views import AdminStatsView
# import others like UserList, OrderUpdate as needed

urlpatterns = [
    path('dashboard/stats/', AdminStatsView.as_view(), name='admin_stats'),
    # e.g. path('users/', UserListView.as_view()),
    # path('orders/', OrderListView.as_view()), ...
]
