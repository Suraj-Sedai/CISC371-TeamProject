from django.db import models
from django.conf import settings


class Workout(models.Model):


    WORKOUT_TYPE_CHOICES = [
        ("Cardio", "Cardio"),
        ("Strength", "Strength"),
        ("HIIT", "HIIT"),
        ("Mobility", "Mobility"),
        ("Other", "Other"),
    ]

    INTENSITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workouts",
    )
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=WORKOUT_TYPE_CHOICES, default="Cardio")
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    intensity = models.CharField(max_length=20, choices=INTENSITY_CHOICES, default="Medium")
    notes = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.name} ({self.date})"
