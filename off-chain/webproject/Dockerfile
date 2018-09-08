FROM python:3.5-onbuild
RUN apt-get update && apt-get install -y gettext && apt-get install libav-tools

RUN mkdir -p /config
ADD requirements.txt /config/
ADD requirements-docker.txt /config/
RUN pip install -r /config/requirements.txt && pip install -r /config/requirements-docker.txt
