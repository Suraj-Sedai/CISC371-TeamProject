from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Workout
from .serializers import WorkoutSerializer


class WorkoutListCreateView(generics.ListCreateAPIView):
    """
    GET: List workouts for the logged-in user
    POST: Create a new workout for the logged-in user
    """

    permission_classes = [IsAuthenticated]
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)


class WorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific workout
    PATCH/PUT: Update workout
    DELETE: Delete workout
    """

    permission_classes = [IsAuthenticated]
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)
