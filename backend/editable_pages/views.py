from django.db.models import OuterRef, Subquery
from rest_framework import generics

from editable_pages.models import EditablePage
from editable_pages.serializers import EditablePageSerializer
from users import permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

import requests
from django.http import JsonResponse
from django.views import View
from .models import ScientificPublication, Tag
from .serializers import ScientificPublicationSerializer, TagSerializer
import json

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

class GetAllTagsView(View):
    def get(self, request):
        tags = Tag.objects.all().values_list('name', flat=True)
        return JsonResponse(list(tags), safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class SaveCardView(View):
    def post(self, request):
        data = json.loads(request.body)
        publication = ScientificPublication.objects.create(
            name=data['name'],
            author=data['author'],
            description=data['description'],
            url=data['url'],
            file=data['file'],
            year=data['year'],
            source=data['source']
        )
        for tag_name in data['tags']:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            publication.tags.add(tag)
        return JsonResponse({'id': publication.id})

@method_decorator(csrf_exempt, name='dispatch')
class SaveNewTagsView(View):
    def post(self, request):
        data = json.loads(request.body)
        tags = data['tags']
        for tag_name in tags:
            Tag.objects.get_or_create(name=tag_name)
        return JsonResponse({'status': 'success'})

@method_decorator(csrf_exempt, name='dispatch')
class DeleteCardView(View):
    def post(self, request):
        data = json.loads(request.body)
        publication_id = data['id']
        try:
            publication = ScientificPublication.objects.get(id=publication_id)
            publication.delete()
            return JsonResponse({'status': 'success'})
        except ScientificPublication.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Publication not found'}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class DeleteTagView(View):
    def post(self, request, pk):
        try:
            tag = Tag.objects.get(pk=pk)
            tag.delete()
            return JsonResponse({'status': 'success'}, status=200)
        except Tag.DoesNotExist:
            return JsonResponse({"error": "Tag not found"}, status=404)

class GetAllCardsView(View):
    def get(self, request):
        publications = ScientificPublication.objects.all()
        serializer = ScientificPublicationSerializer(publications, many=True)
        return JsonResponse(serializer.data, safe=False)

class GetByNameView(View):
    def get(self, request, name):
        publications = ScientificPublication.objects.filter(author__icontains=name)
        serializer = ScientificPublicationSerializer(publications, many=True)
        return JsonResponse(serializer.data, safe=False)

class GetAllAuthorsView(View):
    def get(self, request):
        authors = ScientificPublication.objects.values_list('author', flat=True)
        unique_authors = set()
        for author_list in authors:
            for author in author_list:
                unique_authors.add(author)
        return JsonResponse(list(unique_authors), safe=False)
