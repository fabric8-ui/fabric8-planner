#!/bin/bash
set -x

echo "Setting up paths and working directories..."
BASEPATH=`pwd -P`
PLANNERPATH="$BASEPATH/planner"
PLATFORMPATH="$BASEPATH/platform"

# echo "Setting up some environment variables, which ideally should be set in app as defaults..."
# export FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/api/"
# export FABRIC8_RECOMMENDER_API_URL="https://api-bayesian.dev.rdu2c.fabric8.io/api/v1/"
# export FABRIC8_FORGE_API_URL="https://forge.api.prod-preview.openshift.io"
# export FABRIC8_SSO_API_URL="https://sso.prod-preview.openshift.io/"
# export FABRIC8_REALM="fabric8-test"

echo "Downloading sources..."
git clone https://github.com/fabric8-ui/fabric8-planner.git planner
git clone https://github.com/fabric8-ui/fabric8-ui.git platform

echo "Installing global prerequisites..."
npm install -g rimraf gulp webpack webpack-merge

echo "Building planner library..."
cd $PLANNERPATH
npm install
npm run build:library

echo "Starting docker..."
service docker start

echo "Switching over to f8ui..."
cd $PLATFORMPATH
mkdir -p dist

echo "Making f8ui-builder image and starting the container..."
docker build -t fabric8-ui-builder -f Dockerfile.builder .
docker run -d --name=fabric8-ui-builder -t -v $(pwd)/dist:/dist -v $(pwd)/../planner/dist:/planner -e FABRIC8_BRANDING=openshiftio -e FABRIC8_REALM=fabric8 fabric8-ui-builder

echo "Linking planner to platform within f8ui build container..."
docker exec -u root fabric8-ui-builder npm install
docker exec -u root fabric8-ui-builder npm link /planner

echo "Building platform with integrated planner..."
docker exec -u root fabric8-ui-builder npm run build:prod

# echo "Copy over the build artifacts from container to host..."
# echo ""
# echo "This is only needed if `npm run clean` was performed,"
# echo "which removes the `dist` directory from host, unlinking the volume"
# docker exec -u root fabric8-ui-builder cp -r ./dist /

echo "Generating f8ui integrated planner image from build artifacts..."
docker build -t fabric8-planner-platform .

# echo "Run the container, and visit http://localhost:8080/ on host browser..."
# docker run -it --user=root -p 8080:80 --name=fabric8-planner-platform fabric8-planner-platform
