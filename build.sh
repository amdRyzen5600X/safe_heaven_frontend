#!/usr/bin/bash

podman build -t amdryzen7600x/safe_heaven_frontend --build-arg HOST=$1 --build-arg PORT=$2 .
podman push amdryzen7600x/safe_heaven_frontend


