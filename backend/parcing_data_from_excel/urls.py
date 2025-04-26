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
    ParseGroupCoursesView, ParseAllDataView, ParseAllStudentsView,
    ParseAllStudentsView
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
]
