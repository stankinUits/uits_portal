from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from events.models import UserEvent


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEvent
        fields = '__all__'
        read_only_fields = ('user', 'last_notified_at')
        extra_kwargs = {
            'notification_frequency': {'required': False},
        }

    def validate(self, data):
        if data['started_at'] > data['ended_at']:
            print(data['started_at'], data['ended_at'], data['started_at'] > data['ended_at'])
            raise ValidationError('The start date must be before the end date.')
        return data

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.notify("Уведомление о создании события")
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        return instance