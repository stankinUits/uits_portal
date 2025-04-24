from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('events/', include('events.urls')),
    path('', include(router.urls)),
]
