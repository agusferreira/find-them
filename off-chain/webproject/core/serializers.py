from core.models import *
from rest_framework import serializers


class HintNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HintNotification
        fields = ("find_request", "notified", "index_in_contract")

    def create(self, validated_data):
        _hn = HintNotification()
        for key in self.fields:
            setattr(_hn, key, validated_data[key])

        _hn.save()
        return _hn


class RequestForFindSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestForFind
        fields = ("identifier", "first_name", "last_name", "photo", "description", "creator_address", "creator_email",
                  "contract_deployed_address", "finished")

    def create(self, validated_data):
        _rff = RequestForFind()
        for key in self.fields:
            setattr(_rff, key, validated_data[key])

        _hn.save()
        return _rff
