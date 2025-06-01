#
# from django.urls import path
# from .views import (
#     ParseExcelView, ParseDisciplinesView, ParseLessonTypesView,
#     ParseTeachersView, ParseGroupsView, ParseSemestersView,
#     ParseGroupCoursesView, ParseAllDataView, ParseAllStudentsView
#     # ParseStudentsView
# )
#
# urlpatterns = [
#     path('parse-code-directions/', ParseExcelView.as_view(), name='parse-code-directions'),
#     path('parse-disciplines/', ParseDisciplinesView.as_view(), name='parse-disciplines'),
#     path('parse-lesson-types/', ParseLessonTypesView.as_view(), name='parse-lesson-types'),
#     path('parse-teachers/', ParseTeachersView.as_view(), name='parse-teachers'),
#     path('parse-groups/', ParseGroupsView.as_view(), name='parse-groups'),
#     path('parse-semesters/', ParseSemestersView.as_view(), name='parse-semesters'),
#     path('parse-group-courses/', ParseGroupCoursesView.as_view(), name='parse-group-courses'),
#     path('parse-all/', ParseAllDataView.as_view(), name='parse-all-data'),
#     # path('parse-students/', ParseStudentsView.as_view(), name='parse-students'),
#     path('api/grades/parse-all-students/', ParseAllStudentsView.as_view(), name='parse-all-students'),
# ]


from django.urls import path
from .views import (
    ParseExcelView, ParseDisciplinesView, ParseLessonTypesView,
    ParseTeachersView, ParseGroupsView, ParseSemestersView,
    ParseGroupCoursesView, ParseAllDataView, ParseAllStudentsView, ParseDataForModuleGrade
)

urlpatterns = [
    path('parse-code-directions/', ParseExcelView.as_view(), name='parse-code-directions'),
    path('parse-disciplines/', ParseDisciplinesView.as_view(), name='parse-disciplines'),
    path('parse-lesson-types/', ParseLessonTypesView.as_view(), name='parse-lesson-types'),
    path('parse-teachers/', ParseTeachersView.as_view(), name='parse-teachers'),
    path('parse-groups/', ParseGroupsView.as_view(), name='parse-groups'),
    path('parse-semesters/', ParseSemestersView.as_view(), name='parse-semesters'),
    path('parse-group-courses/', ParseGroupCoursesView.as_view(), name='parse-group-courses'),
    path('parse-all/', ParseAllDataView.as_view(), name='parse-all-data'),
    # path('parse-students/', ParseStudentsView.as_view(), name='parse-students'),
    path('parse-all-students/', ParseAllStudentsView.as_view(), name='parse-all-students'),  # Ensure this line is here
    path('parse_output_for_parcing_module_grade/', ParseDataForModuleGrade.as_view(), name='parse_output_for_parcing_module_grade'),  # Ensure this line is here

]

from django.urls import path
from . import views

urlpatterns = [
    path('api/parse-code-directions/', views.parse_code_directions, name='parse-code-directions'),
    path('api/parse-disciplines/', views.parse_disciplines, name='parse-disciplines'),
    path('api/parse-lesson-types/', views.parse_lesson_types, name='parse-lesson-types'),
    path('api/parse-teachers/', views.parse_teachers, name='parse-teachers'),
    path('api/parse-groups/', views.parse_groups, name='parse-groups'),
    path('api/parse-semesters/', views.parse_semesters, name='parse-semesters'),
    path('api/parse-group-courses/', views.parse_group_courses, name='parse-group-courses'),
    path('api/parse-students/', views.parse_students, name='parse-students'),
    path('api/parse-output-module-grade/', views.parse_output_module_grade, name='parse-output-module-grade'),
    path('api/download-output-files/', views.download_output_files, name='download-output-files'),
]
