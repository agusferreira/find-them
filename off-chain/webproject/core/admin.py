from django.contrib import admin
from solo.admin import SingletonModelAdmin
from import_export.admin import ImportExportModelAdmin
from .models import *


admin.site.register(RequestForFind, ImportExportModelAdmin)
admin.site.register(HintNotification, ImportExportModelAdmin)
admin.site.register(SystemSettings, SingletonModelAdmin)
