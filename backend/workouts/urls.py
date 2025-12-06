from django.urls import path
from .views import WorkoutListCreateView, WorkoutDetailView

app_name = "workouts"

urlpatterns = [
    path("", WorkoutListCreateView.as_view(), name="workout-list"),
    path("<int:pk>/", WorkoutDetailView.as_view(), name="workout-detail"),
]