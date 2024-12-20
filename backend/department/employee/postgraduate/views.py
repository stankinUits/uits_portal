from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from department.employee.postgraduate.models import Postgraduate
from department.employee.postgraduate.serializers import PostgraduateReadSerializer, PostgraduateWriteSerializer, PostgraduateDetailSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsModeratorOrReadOnly


class PostgraduateAPIViewset(viewsets.ModelViewSet):
    queryset = Postgraduate.objects.all()
    permission_classes = [IsModeratorOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_fields = ['student', 'teacher', 'student__diploma_theme', 'student__speciality']
    ordering_fields = ['student', 'teacher', 'student__admission_year']
    ordering = ['student']

    def get_serializer_class(self, *args, **kwargs):
        match self.action:
            case 'list':
                return PostgraduateReadSerializer
            case 'create':
                return PostgraduateWriteSerializer
            case 'retrieve':
                return PostgraduateDetailSerializer
            case _:
                return PostgraduateReadSerializer
