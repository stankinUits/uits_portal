from rest_framework import serializers
from department.employee.models import Teacher
from department.employee.guidance.models import Student
from department.employee.postgraduate.models import Postgraduate


class StudentPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'last_name',
            'first_name',
            'patronymic',
            'group',
            'education_level',
            'speciality',
            'diploma_theme',
            'admission_year',
        ]

    def create(self, validated_data):
        student = Student(**validated_data)
        student.clean()
        student.save()
        return student

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.clean()
        instance.save()
        return instance


class StudentReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['full_name', 'diploma_theme', 'speciality', 'admission_year']


class TeacherReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['full_name']


class PostgraduateReadSerializer(serializers.ModelSerializer):
    student = StudentReadSerializer()
    teacher = TeacherReadSerializer()

    class Meta:
        model = Postgraduate
        fields = [
            'id',
            'student',
            'teacher',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.student is None:
            representation['student'] = {
                "full_name": "Не назначено",
                "diploma_theme": 'Не назначена',
                "speciality": 'Не назначена',
                "admission_year": 'Не назначен'
            }
        if instance.teacher is None:
            representation['teacher'] = {"full_name": "Не назначено"}
        return representation


class PostgraduateDetailSerializer(serializers.ModelSerializer):
    student = StudentReadSerializer()
    teacher = TeacherReadSerializer()

    class Meta:
        model = Postgraduate
        fields = [
            'id',
            'student',
            'teacher',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['details'] = {
            "student_details": representation.pop('student', None),
            "teacher_details": representation.pop('teacher', None)
        }
        return representation


class PostgraduateWriteSerializer(serializers.ModelSerializer):
    student = StudentPOSTSerializer()
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all().order_by('last_name'))

    class Meta:
        model = Postgraduate
        fields = [
            'id',
            'student',
            'teacher',
        ]

    def create(self, validated_data):
        student_data = validated_data.pop('student')
        student = Student.objects.create(**student_data)

        if student.education_level != Student.EducationLevel.POSTGRADUATE:
            raise serializers.ValidationError(
                f"Студент {student.full_name} не является аспирантом."
            )

        postgraduate = Postgraduate.objects.create(student=student, **validated_data)
        return postgraduate

    def update(self, instance, validated_data):
        student_data = validated_data.pop('student', None)

        if student_data:
            student = instance.student
            for attr, value in student_data.items():
                setattr(student, attr, value)
            student.save()

            if student.education_level != Student.EducationLevel.POSTGRADUATE:
                raise serializers.ValidationError(
                    f"Студент {student.full_name} не является аспирантом."
                )

        instance.teacher = validated_data.get('teacher', instance.teacher)
        instance.save()
        return instance
