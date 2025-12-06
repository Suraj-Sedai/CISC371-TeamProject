from rest_framework import serializers
from .models import Workout


class WorkoutSerializer(serializers.ModelSerializer):
   

    class Meta:
        model = Workout
        fields = [
            "id",
            "name",
            "type",
            "duration",
            "intensity",
            "notes",
            "date",
            "created_at",
        ]
        read_only_fields = ["id", "date", "created_at"]

    def create(self, validated_data):
        # Attach the logged-in user to the workout
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)