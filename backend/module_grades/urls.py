from django.urls import path
from . import views

app_name = 'module_grades'  # Namespacing the app

urlpatterns = [
    path('', views.load_csv_and_render, name='index'),
    path('save/', views.save_grades, name='save_grades'),
]
