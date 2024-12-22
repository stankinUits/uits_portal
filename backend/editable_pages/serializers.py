from rest_framework import serializers

from editable_pages.models import EditablePage, ScientificPublication, Tag


class EditablePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EditablePage
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ScientificPublicationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = ScientificPublication
        fields = '__all__'