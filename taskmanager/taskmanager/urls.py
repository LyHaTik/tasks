from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tasks.views import TaskViewSet, CustomUserViewSet, UserRegistrationView


custom_urls = [
    path("auth/users/me/", CustomUserViewSet.as_view({"get": "retrieve", "put": "update"}), name="user-me"),
    path("auth/register/", UserRegistrationView.as_view(), name="user-register"),
]

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('auth/', include('djoser.urls.jwt')),
    path('', include(custom_urls)),
]

