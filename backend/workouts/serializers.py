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
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
