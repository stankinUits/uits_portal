from django.urls import path
from .views import FillTemplateView

urlpatterns = [
    path(
        'fill-template/<str:group_name>/',
        FillTemplateView.as_view(),
        name='fill-template'
    ),
]