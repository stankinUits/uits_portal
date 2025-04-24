from rest_framework import serializers

from .models import Teacher, HelpersEmployee


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = [
            'id',
            'last_name',
            'first_name',
            'patronymic',
            'position',
            'degree',
            'rank',
            'experience',
            'professional_experience',
            'education',
            'qualification',
            'bio',
            'phone_number',
            'email',
            'messenger',
            'avatar'
        ]


class HelpersEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpersEmployee
        fields = '__all__'
