FILE=development.yml
WEB=`docker-compose -f $(FILE) ps | grep gunicorn | cut -d\  -f 1 | head -n 1`
WEBS=`docker-compose -f $(FILE) ps | grep gunicorn | cut -d\  -f 1 `
CELERY=`docker-compose ps | grep 'celery worker' | cut -d\  -f 1 | head -n 1`
BACKUPS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/backups/)
ENV_STAGE = ``

########
#DEPLOY#
########

clean-nginx-conf:
	rm -f nginx/sites-enabled/nginx.conf

deploy-production: clean-nginx-conf
	make clean build up set-django FILE=production.yml

deploy-dev: clean-nginx-conf
	make clean build up set-django FILE=development.yml

#########
#ACTIONS#
#########

build:
	docker-compose -f $(FILE) build

up:
	docker-compose -f $(FILE) up -d web nginx postgres

start:
	docker-compose -f $(FILE) start

stop:
	docker-compose -f $(FILE) stop

ps:
	docker-compose -f $(FILE) ps
	@echo "---------------------------"
	@echo "Web:     `ps aux | grep /usr/local/bin/gunicorn | grep -v grep | wc -l` threads running"
	@echo "Celery:  `ps aux | grep "celery worker" | grep -v grep | wc -l` threads running"

clean: stop
	docker-compose -f $(FILE) rm -f

restart: clean build up ps
	@echo "Restarted all containers"

reboot-db:
	docker exec bb-postgres /bin/sh -c "dropdb -U postgres postgres"
	docker exec bb-postgres /bin/sh -c "createdb -U postgres postgres"


##############
#CONSOLE LOGS#
##############

shell-nginx:
	docker exec -ti ft-nginx bash

shell-web:
	docker exec -ti $(WEB) bash

shell-db:
	docker exec -ti bb-postgres bash


######
#LOGS#
######

log-nginx:
	docker-compose logs ft-nginx

log-web:
	docker-compose logs $(WEB)

log-web-live:
	docker logs --tail 50 --follow --timestamps $(WEB)

log-db:
	docker-compose logs bb-postgres


############
#DJANGO OPS#
############

lint:
	pylint --load-plugins pylint_django --msg-template='({category}) {module} - ({line}) {obj} {column} {msg}' web/*

collectstatic:
	@echo $(shell for container in $(WEBS); do\
		docker exec $$container /bin/sh -c "python manage.py collectstatic --noinput" ;\
	done)

clearcache:
	docker exec $(WEB) /bin/sh -c "python manage.py clear_cache"

migrate:
	docker exec $(WEB) /bin/sh -c "python manage.py migrate"

makemigrations:
	docker exec $(WEB) /bin/sh -c "python manage.py makemigrations"

compilemessages:
	@echo $(shell for container in $(WEBS); do\
		docker exec $$container /bin/sh -c "python manage.py compilemessages" ;\
	done)

set-django: collectstatic migrate compilemessages
	@echo "Django environment setup complete."
