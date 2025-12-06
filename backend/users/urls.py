# users/urls.py
# =============

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView,
    UserProfileView,
    UserStatsListView,
    UserStatsDetailView,
    LogoutView,
    search_food,
)

app_name = 'users'

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Weight Stats
    path('stats/', UserStatsListView.as_view(), name='stats-list'),
    path('stats/<int:pk>/', UserStatsDetailView.as_view(), name='stats-detail'),

    # Calorie Tracker
    path('search-food/', search_food, name='search-food'),  
]
