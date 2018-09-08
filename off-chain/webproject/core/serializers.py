from django.contrib.auth import get_user_model
from django.utils.translation import ugettext as _
from rest_framework import serializers
from core.models import User


# Get the UserModel
UserModel = get_user_model()

class ShortUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', )


class UserSerializer(serializers.ModelSerializer):
    created_by = ShortUserSerializer(read_only=True)
    updated_by = ShortUserSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'created_by', 'updated_by', 'date_joined', 'updated_at', )
