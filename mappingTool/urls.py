from django.conf.urls import patterns, url
from mappingTool import views

urlpatterns = patterns('',
    url(r'^$', views.Mapping.as_view(), name='index'),
    url(r'^signin/$', views.Signin.as_view(), name='signin'),
)
