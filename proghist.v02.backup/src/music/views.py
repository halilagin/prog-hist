from django.shortcuts import render
from django.http import HttpResponse
from .models import Album
from django.template import loader
from rest_framework.views import APIView
from music.serializers import AlbumSerializer
from rest_framework.response import Response
# Create your views here.



def index(request):
    albums = Album.objects.all()
    template = loader.get_template("music/index.html")
    
    context = {
        "albums" : albums,
        }
    return HttpResponse(template.render(context, request))


def details(request, album_id):
    return HttpResponse("<h2>details for album "+ str(album_id)+"</h2>")


class AlbumList(APIView):
    pass
    
    def get(self, request):
        
        albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many = True)
        return Response(serializer.data)
    
    def post(self):
        pass