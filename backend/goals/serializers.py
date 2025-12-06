from rest_framework import serializers
from .models import Goal

class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "title",
            "description",
            "goal_type",
            "target_value",
            "current_value",
            "start_date",
            "end_date",
            "completed",
            "progress_percentage",
            "is_overdue",
        ]
        read_only_fields = ["start_date", "progress_percentage", "is_overdue"]
        extra_kwargs = {
            "goal_type": {"required": False},
            "description": {"required": False},
        }
