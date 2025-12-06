from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Extended user model with fitness-related fields"""
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say'),
    ]
    
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Height in cm")
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Weight in kg")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override username requirement - use email as primary identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    @property
    def bmi(self):
        """Calculate BMI if height and weight are available"""
        if self.height and self.weight:
            height_m = float(self.height) / 100
            return round(float(self.weight) / (height_m ** 2), 2)
        return None
    
    @property
    def bmr(self):
        """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
        if not all([self.weight, self.height, self.age, self.gender]):
            return None
        
        weight_kg = float(self.weight)
        height_cm = float(self.height)
        
        if self.gender == 'M':
            bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * self.age) + 5
        else:  # Female or Other
            bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * self.age) - 161
        
        return round(bmr, 2)


class UserStats(models.Model):
    """Track user's weight history over time"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stats_history')
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
        verbose_name_plural = "User Stats"
    
    def __str__(self):
        return f"{self.user.email} - {self.date}: {self.weight}kg"