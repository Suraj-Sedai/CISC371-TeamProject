# backend/urls.py
# ===============

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # User authentication and profile endpoints
    path('api/auth/', include('users.urls')),
    path('api/workouts/', include('workouts.urls')),
    # Future endpoints
    # path('api/workouts/', include('workouts.urls')),
    # path('api/goals/', include('goals.urls')),
    path("api/goals/", include("goals.urls")),

]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
