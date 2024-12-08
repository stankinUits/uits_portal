from django.urls import path
from .views import ScientificPublicationsSearchView, GetAllTagsView, SaveCardView, SaveNewTagsView, DeleteCardView

from editable_pages.views import EditablePageAPIView

urlpatterns = [
    path('<slug:page>', EditablePageAPIView.as_view(), name='editable-page'),
    path('scientific_publications/search_for_scientist/<str:name>/', ScientificPublicationsSearchView.as_view(), name='search_for_scientist'),
    path('editable-pages/scientific_publications/get_all_tags/', GetAllTagsView.as_view(), name='get_all_tags'),
    path('editable-pages/scientific_publications/save_card/', SaveCardView.as_view(), name='save_card'),
    path('editable-pages/scientific_publications/save_new_tags/', SaveNewTagsView.as_view(), name='save_new_tags'),
    path('editable-pages/scientific_publications/delete_card/', DeleteCardView.as_view(), name='delete_card'),
]