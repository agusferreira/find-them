from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from core.models import User


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', )
    readonly_fields = ('created_by', 'last_login', 'date_joined')
    fieldsets = (
        (
            _('Personal Info'),
            {
                'fields': (
                    'username', 'first_name', 'password', 'last_name', 'email'
                )
            }
        ),
        (
            _('Group and Permissions Info'),
            {
                'fields': (
                    'is_active', 'is_staff', 'is_superuser',
                    'groups', 'user_permissions'
                )
            }
        ),
        (
            _('Audit Info'),
            {
                'fields': ('last_login', 'date_joined', 'created_by')
            }
        ),
    )


admin.site.register(User, CustomUserAdmin)
