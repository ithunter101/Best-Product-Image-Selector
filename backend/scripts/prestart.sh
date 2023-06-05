#! /usr/bin/env bash

if [ -f ./.venv/bin/python ]; then
    DEFAULT_PYTHON_VENV_PATH=./.venv/bin/
else [ -f ./venv/bin/python ];
    DEFAULT_PYTHON_VENV_PATH=./venv/bin/
fi
PYTHON_VENV_PATH=${DEFAULT_PYTHON_VENV_PATH:-$DEFAULT_PYTHON_VENV_PATH}
## Run migrations
${PYTHON_VENV_PATH}python manage.py migrate
