from rest_framework import serializers
from .models import UserInteractionData

class UserInteractionDataSerializer(serializers.ModelSerializer):
    pass

    class Meta:
        model = UserInteractionData
        #fields =('artist', 'title')
        fields ="__all__"

 