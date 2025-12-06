from django.db import models
from django.conf import settings
from datetime import date
from goals.models import Goal

class Workout(models.Model):
    WORKOUT_TYPE_CHOICES = [
        ("cardio", "Cardio"),
        ("strength", "Strength"),
        ("flexibility", "Flexibility"),
        ("hiit", "HIIT"),
        ("mobility", "Mobility"),
        ("other", "Other"),
    ]

    INTENSITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="workouts"
    )
    name = models.CharField(max_length=255)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    calories_burned = models.FloatField(default=0)
    type = models.CharField(max_length=50, choices=WORKOUT_TYPE_CHOICES, default="other")
    intensity = models.CharField(max_length=50, choices=INTENSITY_CHOICES, blank=True, default="Medium")
    notes = models.TextField(blank=True, default="")
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_goals_progress()

    def update_goals_progress(self):
        """Update user's goals based on this workout."""
        goals = Goal.objects.filter(user=self.user, completed=False)
        for goal in goals:
            if goal.goal_type == "workout_time":
                goal.current_value += self.duration
            elif goal.goal_type == "muscle_gain" and self.type == "strength":
                goal.current_value += 1  # simple example: 1 unit per strength workout
            elif goal.goal_type == "weight_loss":
                goal.current_value += self.calories_burned / 7700  # approx kg from calories
            goal.save()
