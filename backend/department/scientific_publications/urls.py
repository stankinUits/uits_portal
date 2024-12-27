from django.urls import path, include
from .views import (
    ScientificPublicationsSearchView,
    GetAllTagsView,
    SaveCardView,
    SaveNewTagsView,
    DeleteCardView,
    DeleteTagView,
    GetAllCardsView,
    GetByNameView,
    GetAllAuthorsView
)

urlpatterns = [
    path('search_for_scientist/<str:name>/', ScientificPublicationsSearchView.as_view(), name='search_for_scientist'),
    path('get_all_tags/', GetAllTagsView.as_view(), name='get_all_tags'),
    path('save_card/', SaveCardView.as_view(), name='save_card'),
    path('save_new_tags/', SaveNewTagsView.as_view(), name='save_new_tags'),
    path('delete_card/', DeleteCardView.as_view(), name='delete_card'),
    path('delete_tag/<int:pk>/', DeleteTagView.as_view(), name='delete_tag'),
    path('get_cards/', GetAllCardsView.as_view(), name='get_cards'),
    path('get/<str:name>/', GetByNameView.as_view(), name='get_by_name'),
    path('get_all_authors/', GetAllAuthorsView.as_view(), name='get_all_authors'),
]