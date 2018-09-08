from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext as _


class User(AbstractUser):
    created_by = models.ForeignKey('User', verbose_name=_('creator'), null=True, blank=True, on_delete=models.SET_NULL)
    updated_by = models.ForeignKey('User', verbose_name=_('updated by'), null=True, blank=True, on_delete=models.SET_NULL, related_name="updated_by_user")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    def get_full_name(self):
        return "{0} {1}".format(self.first_name, self.last_name)
