from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            'id', 'user', 'file', 'file_name', 'comment',
            'size', 'uploaded', 'downloaded', 'special_link'
        ]
        read_only_fields = ['id', 'user', 'size', 'uploaded', 'downloaded', 'special_link']

    def create(self, validated_data):
        file_obj = validated_data.get('file')
        validated_data['file_name'] = file_obj.name
        validated_data['size'] = file_obj.size
        return super().create(validated_data)
