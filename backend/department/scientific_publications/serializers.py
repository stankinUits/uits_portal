from rest_framework import serializers

from .models import ScientificPublication, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ScientificPublicationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = ScientificPublication
        fields = '__all__'