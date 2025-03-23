from django.urls import path

from .views import TeacherAPIViewSet, HelpersEmployeeViewSet

urlpatterns = [
    path('teachers/', TeacherAPIViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
  
    path('teachers/uvp/', HelpersEmployeeViewSet.as_view({
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
    })),
  
    path('teachers/<int:pk>/subject', TeacherAPIViewSet.as_view({
        'get': 'get_subjects',
    })),
  
    path('teachers/all-schedule', TeacherAPIViewSet.as_view({
        'get': 'retrieve_all_schedule',
    })),

    # Маршруты для расписания экзаменов
    path('teachers/with-graduation-exam-schedule/', TeacherAPIViewSet.as_view({
        'get': 'get_teachers_with_graduation_exam_schedule',
    })),
    path('teachers/with-non-graduation-exam-schedule/', TeacherAPIViewSet.as_view({
        'get': 'get_teachers_with_non_graduation_exam_schedule',
    })),
]
