from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Teacher, HelpersEmployee
from .schedule.serializers import ScheduleSerializer
from .serializers import TeacherSerializer, HelpersEmployeeSerializer

from .subject.serializers import SubjectSerializer


# Create your views here.

class TeacherAPIViewSet(ModelViewSet):
    queryset = Teacher.objects.all().order_by('last_name', 'first_name', 'patronymic')
    serializer_class = TeacherSerializer

    @action(detail=True, methods=['POST'], url_path='schedule')
    def import_schedule(self, request, *args, **kwargs):
        teacher: Teacher = self.get_object()
        file: InMemoryUploadedFile = request.FILES['file']

        print(teacher, file)
        print(request.data)
        teacher.import_schedule(file)
        return Response(status=200)

    @action(detail=True, methods=['GET'], url_path='subject')
    def get_subjects(self, request, *args, **kwargs):
        teacher: Teacher = self.get_object()
        serializer = SubjectSerializer(teacher.subjects, many=True)
        
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'], url_path='schedule')
    def retrieve_schedule(self, request, *args, **kwargs):
        teacher: Teacher = self.get_object()
        serializer = ScheduleSerializer(teacher.schedule)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='all-schedule')
    def retrieve_all_schedule(self, request, *args, **kwargs):
        teachers = self.get_queryset()
        schedules = []
        
        for teacher in teachers:
            if hasattr(teacher, 'schedule') and teacher.schedule is not None:
                schedules.append(teacher.schedule)
        
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='schedule')
    def update_schedule(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        teacher = self.get_object()
        instance = teacher.schedule
        serializer = ScheduleSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='with-graduation-exam-schedule')
    def get_teachers_with_graduation_exam_schedule(self, request):
        """
        Получить преподавателей с расписанием экзаменов для выпускных курсов.
        """
        # Фильтруем преподавателей, у которых есть расписание для выпускных курсов
        teachers = Teacher.objects.filter(exam_schedule_graduation__isnull=False)
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='with-non-graduation-exam-schedule')
    def get_teachers_with_non_graduation_exam_schedule(self, request):
        """
        Получить преподавателей с расписанием экзаменов для невыпускных курсов.
        """
        # Фильтруем преподавателей, у которых есть расписание для невыпускных курсов
        teachers = Teacher.objects.filter(exam_schedule_non_graduation__isnull=False)
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='update-profile')
    def update_teacher_profile(self, request, pk=None):
        """
        Обновление профиля преподавателя
        """
        teacher = self.get_object()
        serializer = self.get_serializer(teacher, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class HelpersEmployeeViewSet(ModelViewSet):
    queryset = HelpersEmployee.objects.all().order_by('last_name', 'first_name', 'patronymic')
    serializer_class = HelpersEmployeeSerializer
