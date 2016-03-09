from django.views.generic import TemplateView
from mappingTool.models import Mapping


class Mapping(TemplateView):
    model = Mapping
    template_name = 'mappingTool/main/index.html'