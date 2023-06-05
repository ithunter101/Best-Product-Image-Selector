# Dockerfile
# pull official base image
FROM python:3.10.11
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /app
# set work directory
WORKDIR /app
# create and activate virtual environment
RUN python3 -m venv .venv

RUN ./.venv/bin/python3 -m pip install pip setuptools wheel --upgrade

# copy and install pip requirements
COPY requirements.txt /app/requirements.txt
RUN /app/.venv/bin/pip3 install -r /app/requirements.txt
# copy Django project files
COPY ./ /app/


ENV PYTHONPATH=/app

RUN chmod +x ./scripts/start.sh

CMD ["./scripts/start.sh"]