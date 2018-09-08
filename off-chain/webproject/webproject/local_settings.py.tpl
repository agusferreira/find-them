import os

# DATABASE
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql_psycopg2',
       'NAME': os.getenv('DB_NAME', 'db_name'),
       'USER': os.getenv('DB_USER', 'db_username'),
       'PASSWORD': os.getenv('DB_PASS', 'db_password'),
       'HOST': os.getenv('DB_SERVICE', 'localhost'),
       'PORT': os.getenv('DB_PORT', '5432'),
   }
}
