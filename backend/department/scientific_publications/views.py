import json
import requests
from django.http import JsonResponse
from django.views import View
from .models import Tag, ScientificPublication
from .serializers import ScientificPublicationSerializer, TagSerializer
import os
from rest_framework.permissions import IsAuthenticated

class ScientificPublicationsSearchView(View):
    def get(self, request, name):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        api_key = os.environ.get('SERP_API_KEY')
        search_url = f"https://serpapi.com/search.json?engine=google_scholar&q={name}&api_key={api_key}"

        science_publication_cards = []
        current_page = 1

        while True:
            response = requests.get(search_url)

            if response.status_code != 200:
                return JsonResponse({
                    'isOverRequested': True,
                    'sciencePublicationCards': []
                })

            data = response.json()
            organic_results = data.get('organic_results', [])

            # science_publication_cards = []
            for result in organic_results:
                publication = {
                    'title': result.get('title', ''),
                    'link': result.get('link', ''),
                    'name': name,
                    'description': result.get('snippet', '')
                }
                science_publication_cards.append(publication)

            # Проверяем, есть ли следующая страница
            serpapi_pagination = data.get('serpapi_pagination', {})
            next_page_url = serpapi_pagination.get('next')

            if not next_page_url:
                break  # Если следующей страницы нет, выходим из цикла

            search_url = f"{next_page_url}&api_key={api_key}"
            print(search_url) # Обновляем URL для следующего запроса
            current_page += 1

        return JsonResponse({
            'isOverRequested': False,
            'sciencePublicationCards': science_publication_cards
        })

class GetAllTagsView(View):
    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return JsonResponse(serializer.data, safe=False)

class SaveCardView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        data = json.loads(request.body)

        publication = ScientificPublication.objects.create(
            name=data['name'],
            author=data['author'],
            description=data['description'],
            url=data['url'],
            file=data['file'],
            year=data['year'],
            source=data['source'],
            pages=data.get('pages', ''),
            vol_n=data.get('vol_n', ''),
            isbn=data.get('isbn', '')
        )

        for tag_name in data['tags']:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            publication.tags.add(tag)

        return JsonResponse({'id': publication.id})


class EditCardView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        data = json.loads(request.body)
        try:
            publication = ScientificPublication.objects.get(id=data['id'])
        except ScientificPublication.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Publication not found'}, status=404)

        # Обновляем поля
        publication.name = data['name']
        publication.author = data['author']
        publication.description = data['description']
        publication.url = data['url']
        publication.file = data['file']
        publication.year = data['year']
        publication.source = data['source']
        publication.pages = data.get('pages', '')
        publication.vol_n = data.get('vol_n', '')
        publication.isbn = data.get('isbn', '')
        publication.save()

        # Обновляем теги
        publication.tags.clear()
        for tag_name in data['tags']:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            publication.tags.add(tag)

        # Сериализуем обновленную карточку
        serializer = ScientificPublicationSerializer(publication)
        return JsonResponse({'status': 'success', 'publication': serializer.data})

class SaveNewTagsView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        data = json.loads(request.body)
        tags = data['tags']
        for tag_name in tags:
            Tag.objects.get_or_create(name=tag_name)
        return JsonResponse({'status': 'success'})

class DeleteCardView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        data = json.loads(request.body)
        publication_id = data['id']
        try:
            publication = ScientificPublication.objects.get(id=publication_id)
            publication.delete()
            return JsonResponse({'status': 'success'})
        except ScientificPublication.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Publication not found'}, status=404)

class DeleteTagView(View):
    def post(self, request, name):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        try:
            tag = Tag.objects.get(name=name)
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