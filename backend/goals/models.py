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

    @property
    def progress_percentage(self):
        """Return 0–100 progress."""
        if self.target_value == 0:
            return 0
        progress = (self.current_value / self.target_value) * 100
        return round(min(progress, 100), 2)

    @property
    def is_overdue(self):
        return date.today() > self.end_date and not self.completed
