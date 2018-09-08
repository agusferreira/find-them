from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from core.services import contract_service
from .models import *
from .serializers import RequestForFindSerializer, HintNotificationSerializer
from .utils import run_async


class RequestForFindViewSet(APIView):

    def get(self, request, contract_deployed_address=None):
        if contract_deployed_address:
            rff = get_object_or_404(RequestForFind, contract_deployed_address=contract_deployed_address, finished=False)
            serializer_data = RequestForFindSerializer(rff, many=False)
        else:
            rffs = RequestForFind.objects.filter(finished=False)
            serializer_data = RequestForFindSerializer(rffs, many=True)

        return Response(serializer_data.data)

    def post(self, request):
        serializer = RequestForFindSerializer(data=request.data, many=False)
        index = request.POST.get('index', None)
        if not index:
            return Response({"index":["Este campo es requerido."]}, status=status.HTTP_400_BAD_REQUEST)

        serializer.is_valid(raise_exception=True)
        request_for_find = serializer.save()

        run_async(contract_service.validate_contract, int(index), request_for_find)

        return Response(serializer.data)


class HintsViewSet(APIView):

    def post(self, request):
        serializer = HintNotificationSerializer(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
