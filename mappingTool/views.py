from django.shortcuts import render

# Create your views here.
from django.views import generic
from django.views.generic import  TemplateView
from mappingTool.models import Mapping


class Mapping(TemplateView):
    model = Mapping
    template_name = 'mappingTool/main/index.html'

class Signin(TemplateView):
    template_name = 'mappingTool/authentication/signin.html'