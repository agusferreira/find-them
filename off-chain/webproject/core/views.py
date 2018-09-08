from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.utils.translation import ugettext as _
from django.http import Http404

from core.serializers import UserSerializer, ShortUserSerializer
from core.models import User


class UserAPIView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request, format=None):
        users = User.objects.filter(is_active=True)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExistingUserAPIView(APIView):
    permission_classes = (AllowAny, )

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk, is_active=True)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk=None, format=None):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

