from django.urls import path
from .views import ScientificPublicationsSearchView, GetAllTagsView, SaveCardView, SaveNewTagsView, DeleteCardView, DeleteTagView, GetAllCardsView, GetByNameView, GetAllAuthorsView

from editable_pages.views import EditablePageAPIView

urlpatterns = [
    path('editable-pages/<slug:page>/', EditablePageAPIView.as_view(), name='editable-page'),
    path('scientific_publications/search_for_scientist/<str:name>/', ScientificPublicationsSearchView.as_view(), name='search_for_scientist'),
    path('scientific_publications/get_all_tags/', GetAllTagsView.as_view(), name='get_all_tags'),
    path('scientific_publications/save_card/', SaveCardView.as_view(), name='save_card'),
    path('scientific_publications/save_new_tags/', SaveNewTagsView.as_view(), name='save_new_tags'),
    path('scientific_publications/delete_card/', DeleteCardView.as_view(), name='delete_card'),
    path('scientific_publications/delete_tag/<int:pk>/', DeleteTagView.as_view(), name='delete_tag'),
    path('scientific_publications/get_cards/', GetAllCardsView.as_view(), name='get_cards'),
    path('scientific_publications/get/<str:name>/', GetByNameView.as_view(), name='get_by_name'),
    path('scientific_publications/get_all_authors/', GetAllAuthorsView.as_view(), name='get_all_authors'),
]
