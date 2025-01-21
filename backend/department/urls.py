from django.urls import path, include

urlpatterns = [
    path('news/', include('department.news.urls')),
    path('achievements/', include('department.achievements.urls')),
    path('employee/', include('department.employee.urls')),
    path('postgraduate/', include('department.employee.postgraduate.urls'))
    path('scientific_publications/', include('department.scientific_publications.urls')),
]
