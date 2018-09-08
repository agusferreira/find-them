from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import *

admin.site.register(RequestForFind, ImportExportModelAdmin)
admin.site.register(HintNotification, ImportExportModelAdmin)
