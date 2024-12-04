from django.urls import path
from . import views

from editable_pages.views import EditablePageAPIView

urlpatterns = [
    path('<slug:page>', EditablePageAPIView.as_view(), name='editable-page'),
]