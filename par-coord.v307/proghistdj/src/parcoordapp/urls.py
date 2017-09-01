from django.conf.urls import url
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url(r'^streaming/fetchdata', views.ParallelCoordRest.as_view(), name="ParallelCoordRestV3"),
    url(r'^iriscorr/eigens', views.ParallelCoordIrisEigensRest.as_view(), name="ParallelCoordIrisEigensRestV3"),
    url(r'^iriscorr/fetchData', views.ParallelCoordIrisDataRest.as_view(), name="ParallelCoordIrisDataRestV3"),
    url(r'^iriskmeans/oftwovars', views.ParallelCoordIrisKmeansRest.as_view(), name="ParallelCoordIrisKmeansRestV3"),



]

urlpatterns = format_suffix_patterns(urlpatterns)



