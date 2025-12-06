from django.db import models
from django.conf import settings
from datetime import date

class Goal(models.Model):
    GOAL_TYPE_CHOICES = [
        ("weight_loss", "Weight Loss"),
        ("muscle_gain", "Muscle Gain"),
        ("workout_time", "Total Workout Time"),
        ("custom", "Custom Goal"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    goal_type = models.CharField(max_length=50, choices=GOAL_TYPE_CHOICES, default="custom")
    target_value = models.FloatField(help_text="E.g., lose 5 kg -> target=5")
    current_value = models.FloatField(default=0)

    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()

    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["completed", "end_date"]

    def __str__(self):
        return f"{self.title} - {self.user.email}"

    def update_progress(self, workout):
        """Auto update progress based on workout."""
        if self.completed:
            return

        if self.goal_type == "workout_time":
            self.current_value += workout.duration
        elif self.goal_type == "muscle_gain" and workout.type == "strength":
            self.current_value += 1  # 1 unit per strength workout
        elif self.goal_type == "weight_loss":
            # Approximate kg from calories burned
            self.current_value += workout.calories_burned / 7700

        # Auto mark as completed if reached target
        if self.current_value >= self.target_value:
            self.completed = True
            self.current_value = min(self.current_value, self.target_value)

        self.save()

    @property
    def progress_percentage(self):
        """Return progress percentage (0-100%). Auto-complete goal if >=100%."""
        if self.target_value == 0:
            return 0
        progress = (self.current_value / self.target_value) * 100
        return round(min(progress, 100), 2)

    @property
    def is_overdue(self):
        return date.today() > self.end_date and not self.completed
