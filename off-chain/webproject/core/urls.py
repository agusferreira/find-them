from django.conf.urls import url, include
from core import views

urlpatterns = [
    url(r'^requests/$', views.RequestForFindViewSet.as_view(),
        name='get_requests'),
    url(r'^requests/(?P<contract_deployed_address>[\w{}.-]{1,200})/$', views.RequestForFindViewSet.as_view(),
        name='get_request_by_deployed_contract_address'),

    url(r'^requests/(?P<contract_deployed_address>[\w{}.-]{1,200})/close/$', views.NearRequestForFindViewSet.as_view(),
        name='get_request_by_deployed_contract_address'),

    url(r'^hints/$', views.HintsViewSet.as_view(),
            name='get_hints'),
]
