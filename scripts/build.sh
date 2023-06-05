#!/usr/bin/env bash
IFS=

if ! command -v "docker compose" > /dev/null;
  then
    docker compose --env-file ./.env up --detach --build
  else
    docker-compose --env-file ./.env up --detach --build
fi