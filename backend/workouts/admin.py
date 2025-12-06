from django.contrib import admin
from .models import Workout


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "type", "intensity", "duration", "date", "created_at")
    list_filter = ("type", "intensity", "date")
    search_fields = ("user__email", "name", "notes")
