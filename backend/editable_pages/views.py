from django.db.models import OuterRef, Subquery
from rest_framework import generics

from editable_pages.models import EditablePage
from editable_pages.serializers import EditablePageSerializer
from users import permissions

import requests
from django.http import JsonResponse
from django.views import View

# Create your views here.
class EditablePageAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = EditablePageSerializer
    permission_classes = [permissions.IsModeratorOrReadOnly]
    lookup_field = 'page'
    lookup_url_kwarg = 'page'

    def get_queryset(self):
        subquery = EditablePage.objects.filter(page=OuterRef('page')).order_by('-modified_at').values('id')[:1]
        return EditablePage.objects.filter(id=Subquery(subquery)).order_by('page', '-modified_at')

class ScientificPublicationsSearchView(View):
    def get(self, request, name):
        # Ваш API ключ для SERP API
        api_key = '244d2e6ba5df5245f7599c14c6ab7a8f190ea5231f3083ac3320764d75046dbf'
        # Пример запроса к Google Scholar
        search_url = f"https://serpapi.com/search.json?engine=google_scholar&q={name}&api_key={api_key}"

        response = requests.get(search_url)

        if response.status_code != 200:
            return JsonResponse({
                'isOverRequested': True,
                'sciencePublicationCards': []
            })

        data = response.json()
        organic_results = data.get('organic_results', [])

        science_publication_cards = []
        for result in organic_results:
            publication = {
                'title': result.get('title', ''),
                'link': result.get('link', ''),
                'name': name,
                'source': result.get('snippet', '')
            }
            science_publication_cards.append(publication)

        return JsonResponse({
            'isOverRequested': False,
            'sciencePublicationCards': science_publication_cards
        })