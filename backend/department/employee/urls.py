from django.urls import path

from .views import TeacherAPIViewSet

urlpatterns = [
    path('teachers/', TeacherAPIViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('teachers/<int:pk>', TeacherAPIViewSet.as_view({
        'get': 'retrieve',
        'delete': 'destroy',
        'patch': 'partial_update'
    })),
    path('teachers/<int:pk>/schedule/import', TeacherAPIViewSet.as_view({
        'post': 'import_schedule'
    })),
    path('teachers/<int:pk>/schedule', TeacherAPIViewSet.as_view({
        'get': 'retrieve_schedule',
    }))
]
