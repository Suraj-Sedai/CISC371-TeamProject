from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserStats


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model"""
    
    list_display = ['email', 'username', 'first_name', 'last_name', 'age', 'gender', 'is_staff', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'gender', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'age', 'gender')}),
        ('Fitness Info', {'fields': ('height', 'weight', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    """Admin for UserStats model"""
    
    list_display = ['user', 'weight', 'date', 'created_at']
    list_filter = ['date', 'created_at']
    search_fields = ['user__email', 'user__username']
    ordering = ['-date']
    date_hierarchy = 'date'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')