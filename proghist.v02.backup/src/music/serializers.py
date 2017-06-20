from rest_framework import serializers
from .models import Album

class AlbumSerializer(serializers.ModelSerializer):
    pass

    class Meta:
        model = Album
        #fields =('artist', 'title')
        fields ="__all__"

 