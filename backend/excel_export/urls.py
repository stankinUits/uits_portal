from django.urls import path
from .views import FillTemplateView, ExportModuleGradeByTeacherDisciplineView

urlpatterns = [
    path(
        'fill-template/<str:group_name>/',
        FillTemplateView.as_view(),
        name='fill-template'
    ),
    path(
        'module-grade-by-teacher-discipline/',
        ExportModuleGradeByTeacherDisciplineView.as_view(),
        name='module-grade-by-teacher-discipline'
    ),
]