#!/bin/bash

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install \
  docker \
  make \
  git 
service docker start

# lets test
docker kill almighty-ui-builder

docker build -t almighty-ui-builder -f Dockerfile.builder .
docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd):/usr/src/app:Z almighty-ui-builder

docker exec almighty-ui-builder npm install
docker exec almighty-ui-builder npm run build:prod

## some tests...?