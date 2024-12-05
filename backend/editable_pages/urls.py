from django.urls import path
from .views import ScientificPublicationsSearchView

from editable_pages.views import EditablePageAPIView

urlpatterns = [
    path('<slug:page>', EditablePageAPIView.as_view(), name='editable-page'),
    path('scientific_publications/search_for_scientist/<str:name>/', ScientificPublicationsSearchView.as_view(), name='search_for_scientist'),
]