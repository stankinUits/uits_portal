from rest_framework import viewsets, permissions

from events.models import UserEvent, StatusChoice
from events.serializers import EventSerializer
from django.db.models import Q

from users.permissions import IsTeacher


# Create your views here.
class EventModelViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        user = self.request.user
        # преподу - созданные и присвоенные ему
        # суперпользователю - созданные и присвоенные ему
        if user.is_teacher or user.is_superuser:
            queryset = UserEvent.objects.filter(
                Q(user=user) | 
                Q(assigned_users__in=[user.id])
            ).distinct()
            
            # Добавляем фильтрацию по статусу, если он указан
            status = self.request.query_params.get('status')
            if status:
                queryset = queryset.filter(status=status)
            
            return queryset
        else:
            # Если пользователь не преподаватель и не суперпользователь, возвращаем пустой набор
            return UserEvent.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        save_params = {
            'user': user,
            'status': StatusChoice.NOT_STARTED,
        }
        if user.is_teacher and not user.is_superuser:
            save_params['assigned_users'] = [user.id]
        serializer.save(**save_params)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        
        if 'status' in data:
            setattr(instance, 'status', data.pop('status'))
        
        return super().update(request, *args, **kwargs)
