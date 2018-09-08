from django.db import models
from django.utils.translation import ugettext_lazy as _


def images_upload_to(instance, filename):
    file_name = filename.split(".")[:-1]
    extension = filename.split(".")[-1]
    return "images/{filename}.{ext}".format(
        filename=file_name, ext=extension)


class RequestForFind(models.Model):
    identifier = models.CharField(max_length=130)
    first_name = models.CharField(max_length=130)
    last_name = models.CharField(max_length=130)
    photo = models.ImageField(upload_to=images_upload_to)
    description = models.TextField(max_length=1024)
    creator_address = models.CharField(max_length=300)
    creator_email = models.EmailField()
    contract_deployed_address = models.CharField(max_length=300)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return '{} {} {}'.format(
            self.first_name,
            self.last_name,
            self.creator_email
        )

    class Meta:
        ordering = ['-id']
        verbose_name = _('Request for find')
        verbose_name_plural = _('Requests for finds')


class HintNotification(models.Model):
    find_request = models.ForeignKey(RequestForFind, on_delete=models.PROTECT)
    notified = models.BooleanField(default=False)
    index_in_contract = models.PositiveIntegerField()
