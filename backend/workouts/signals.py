from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Workout
from goals.models import Goal

@receiver(post_save, sender=Workout)
def update_goals_on_workout(sender, instance, **kwargs):
    # Fetch incomplete goals of the user
    goals = Goal.objects.filter(user=instance.user, completed=False)
    for goal in goals:  # <-- loop over each goal
        if goal.goal_type == "workout_time":
            goal.current_value += instance.duration
        elif goal.goal_type == "muscle_gain" and instance.type == "strength":
            goal.current_value += 1
        elif goal.goal_type == "weight_loss":
            goal.current_value += instance.calories_burned / 7700
        goal.save()
