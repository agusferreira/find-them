# Dear dev,
#    Please copy this file into a .py file and write here any custom setting
#    you need to run this project locally.
#    Below you'll find the basics
#    Regards,
#    rama

import os

# DATABASE
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': os.getenv('DB_NAME', 'db_name'),
       'USER': os.getenv('DB_USER', 'db_username'),
       'PASSWORD': os.getenv('DB_PASS', 'db_password'),
       'HOST': os.getenv('DB_SERVICE', 'localhost'),
       'PORT': os.getenv('DB_PORT', '5432'),
   }
}

CORS_ORIGIN_ALLOW_ALL = True
