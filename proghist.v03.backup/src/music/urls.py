from django.conf.urls import url
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^(?P<album_id>[0-9]+)/$', views.details, name="details"),
    url(r'^albumrest/', views.AlbumList.as_view(), name="albumsrest"),

]

urlpatterns = format_suffix_patterns(urlpatterns)
