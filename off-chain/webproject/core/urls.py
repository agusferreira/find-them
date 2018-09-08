from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from core import views

urlpatterns = [
    # User
    url(r'^users/$', views.UserAPIView.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.ExistingUserAPIView.as_view()),
]
