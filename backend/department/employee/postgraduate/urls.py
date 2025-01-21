from rest_framework.routers import DefaultRouter
from department.employee.postgraduate.views import PostgraduateAPIViewset

router = DefaultRouter()
router.register(r'', PostgraduateAPIViewset)

urlpatterns = router.urls
