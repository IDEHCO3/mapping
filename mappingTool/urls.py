from django.conf.urls import patterns, url
from mappingTool import views

urlpatterns = patterns('',

    url(r'^index$', views.Mapping.as_view(), name='index'),

)
