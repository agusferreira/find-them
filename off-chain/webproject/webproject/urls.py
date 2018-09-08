from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions


urlpatterns = [
    # Django ADMIN
    url(r'^admin/', admin.site.urls),

    # Core
    url(r'api/v1/', include('core.urls')),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
