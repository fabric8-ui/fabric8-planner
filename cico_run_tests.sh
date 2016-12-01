#!/bin/bash

# Show command before executing
set -x

# Source environment variables of the jenkins slave
# that might interest this worker.
if [ -e "jenkins-env" ]; then
  cat jenkins-env \
    | grep -E "(JENKINS_URL|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId)=" \
    | sed 's/^/export /g' \
    > ~/.jenkins-env
  source ~/.jenkins-env
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install \
  docker \
  make \
  git 
service docker start

# Build builder image
docker build -t almighty-ui-builder -f Dockerfile.builder .
mkdir -p dist && docker run --detach=true --name=almighty-ui-builder -e "API_URL=http://demo.api.almighty.io/api/" -t -v $(pwd)/dist:/dist:Z almighty-ui-builder

# Build almighty-ui
docker exec almighty-ui-builder npm install

## Exec unit tests
docker exec almighty-ui-builder ./run_unit_tests.sh

if [ $? -eq 0 ]; then
  echo 'CICO: unit tests OK'
else
  echo 'CICO: unit tests FAIL'
  exit 1
fi

## Exec functional tests
docker exec almighty-ui-builder ./run_functional_tests.sh

## All ok, build prod version
if [ $? -eq 0 ]; then
  echo 'CICO: functional tests OK'

  # Upload coverage to codecov.io
  bash <(curl -s https://codecov.io/bash) -t 73933b5a-4aba-4b55-8612-a809ca4ada30 #-X fix

  docker exec almighty-ui-builder npm run build:prod
  docker exec -u root almighty-ui-builder cp -r /home/almighty/dist /
else
  echo 'CICO: functional tests FAIL'
  exit 1
fi

