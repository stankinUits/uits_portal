from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.decorators import action

from .models import Achievement
from .serializers import AchievementDetailSerializer, ListAchievementSerializer
from .pagination import AchievementLimitOffsetPagination
from users.permissions import IsModeratorOrReadOnly


class AchievementAPIViewSet(
    ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet
):

    queryset = Achievement.objects.filter(is_published=True)
    pagination_class = AchievementLimitOffsetPagination

    permission_classes = [IsModeratorOrReadOnly]

    @action(detail=False, methods=['get'], url_path='teacher/(?P<teacher_id>\d+)')
    def by_teacher(self, request, teacher_id=None):
        achievements = Achievement.objects.filter(
            teacher=teacher_id, is_published=True
        )
        serializer = self.get_serializer(achievements, many=True)
        return Response(serializer.data)

    def get_serializer_class(self, *args, **kwargs):
        match self.action:
            case 'list':
                return ListAchievementSerializer
            case 'retrieve':
                return AchievementDetailSerializer
            case 'by_teacher':
                return ListAchievementSerializer
            case _:
                return super().get_serializer_class(*args, **kwargs)