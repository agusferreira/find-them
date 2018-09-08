from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import RequestForFindSerializer, HintNotificationSerializer


class RequestForFindViewSet(APIView):

    def get(self, request, contract_deployed_address=None):
        if contract_deployed_address:
            rff = get_object_or_404(RequestForFind, contract_deployed_address=contract_deployed_address)
            serializer_data = RequestForFindSerializer(rff, many=False)
        else:
            rffs = RequestForFind.objects.filter(finished=False)
            serializer_data = RequestForFindSerializer(rffs, many=True)

        return Response(serializer_data.data)

    def post(self, request):
        serializer = RequestForFindSerializer(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class HintsViewSet(APIView):

    def post(self, request):
        serializer = HintNotificationSerializer(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)