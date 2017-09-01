from django.conf.urls import url
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url(r'^streaming/createdata', views.ProgHistRest.as_view(), name="ProgHistStreamingRest"),
    url(r'^streaming/saveuserdata', views.UserDataSaveRest.as_view(), name="UserDataSaveRest"),
    url(r'^streaming/userinteractiondata/(?P<userinteraction_id>[0-9]+)/$', views.UserInteractionDataRest.as_view(), name="UserInteractionDataRest"),
    url(r'^streaming/proghistrealdata', views.ProgHistRealDataRest.as_view(), name="ProgHistRealDataRest"),
    url(r'^streaming/gaussianprocess/createdata', views.GaussianProcessDataProducerRest.as_view(), name="GaussianProcessDataProducerRest"),
    url(r'^parallelcoord/streaming/fetchdata', views.ParallelCoordRest.as_view(), name="ParallelCoordRest"),
    url(r'^parallelcoord/iriscorr/eigens', views.ParallelCoordIrisEigensRest.as_view(), name="ParallelCoordIrisEigensRest"),
    url(r'^parallelcoord/iriscorr/fetchData', views.ParallelCoordIrisDataRest.as_view(), name="ParallelCoordIrisDataRest"),


]

urlpatterns = format_suffix_patterns(urlpatterns)



