from django.urls import path
from .views import RoleListView, MyRolesView, RoleRequestView, ApproveRoleView, DeclineRoleView

urlpatterns = [
    path('roles/', RoleListView.as_view(), name='roles-list'),
    path('my-roles/', MyRolesView.as_view(), name='my-roles'),
    path('roles/request/', RoleRequestView.as_view(), name='request-role'),
    path('roles/<int:pk>/approve/', ApproveRoleView.as_view(), name='approve-role'),
    path('roles/<int:pk>/decline/', DeclineRoleView.as_view(), name='decline-role'),
]
