from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, UserStats
from .serializers import (
    UserRegistrationSerializer, 
    UserProfileSerializer, 
    UserStatsSerializer
)
import requests
from decouple import config
from django.http import JsonResponse

FOODDATA_API_KEY = config("FOODDATA_API_KEY")

# --- New addition for Calorie Tracker ---
def search_food(request):
    query = request.GET.get("q", "")
    if not query:
        return JsonResponse({"foods": []})

    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {
        "api_key": FOODDATA_API_KEY,
        "query": query,
        "pageSize": 10
    }
    response = requests.get(url, params=params)
    data = response.json()
    foods = [
        {
            "fdcId": f.get("fdcId"),
            "description": f.get("description"),
            "brandOwner": f.get("brandOwner"),
            "calories": next(
                (n.get("value") for n in f.get("foodNutrients", []) if n.get("nutrientName") == "Energy"),
                0
            ),
        }
        for f in data.get("foods", [])
    ]
    return JsonResponse({"foods": foods})

# --- Original views ---
class UserRegistrationView(generics.CreateAPIView):
    """Register a new user"""
    
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        return self.request.user


class UserStatsListView(generics.ListCreateAPIView):
    """List and create user weight stats"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserStatsSerializer
    
    def get_queryset(self):
        return UserStats.objects.filter(user=self.request.user)


class UserStatsDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a specific weight stat entry"""
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserStatsSerializer
    
    def get_queryset(self):
        return UserStats.objects.filter(user=self.request.user)


class LogoutView(APIView):
    """Logout user by blacklisting refresh token"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
