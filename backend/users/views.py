from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
# from pip._vendor.rich.console.Console import status
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from users.serializers import UserDetailsSerializer
from .models import User
from department.employee.serializers import TeacherSerializer

User = get_user_model()


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_moderator', 'is_teacher']

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def teacher_info(self, request):
        if not request.user.teacher:
            return Response({'detail': 'No teacher associated with this user'}, status=404)
        
        serializer = TeacherSerializer(request.user.teacher)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def teacher_info_by_id(self, request, pk=None):
        try:
            user = self.get_object()
            if not user.teacher:
                raise NotFound('No teacher associated with this user')
            
            serializer = TeacherSerializer(user.teacher)
            return Response(serializer.data)
        except User.DoesNotExist:
            raise NotFound('User not found')

    @action(detail=False, methods=['post'])
    def update_profile(self, request):
        user = request.user
        data = request.data

        # Используем ваш UserDetailsSerializer
        serializer = UserDetailsSerializer(
            user,
            data=data,
            partial=True,  # Разрешаем частичное обновление
            context={'request': request}  # Передаем request в контекст, если нужно
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)