#!/bin/bash
set -x

echo "Setting up working directories..."
BASEPATH=`pwd -P`
PLANNERPATH=""
PLATFORMPATH=""
DRYRUN=false

echo "Parsing CLI arguments..."
for i in "$@"
do
case $i in
    --planner=* )
        if [[ -d "${i#*=}" ]]; then
            # Provided path _is_ indeed a directory
            cd ${i#*=}
            # Let's validate if it contains the Planner source code
            if [[ $(npm view . name) = fabric8-planner ]]; then
                # The path seems to contain package.json which reports to be Planner source
                PLANNERPATH=${i#*=}
                echo "Planner path is set to: $PLANNERPATH"
            else
                echo -e "\e[1;31mCan't resolve source at provided Planner path\e[0m"
                exit 1
            fi
        else
            echo -e "\e[1;31mProvided Planner path is invalid\e[0m"
            exit 1
        fi
        shift;;
    --platform=* )
        if [[ -d "${i#*=}" ]]; then
            # Provided path _is_ indeed a directory
            cd ${i#*=}
            # Let's validate if it contains the Platform source code
            if [[ $(npm view . name) = fabric8-ui ]]; then
                # The path seems to contain package.json which reports to be Platform source
                PLATFORMPATH=${i#*=}
                echo "Platform path is set to: $PLATFORMPATH"
            else
                echo -e "\e[1;31mCan't resolve source at provided Platform path\e[0m"
                exit 1
            fi
        else
            echo -e "\e[1;31mProvided Platform path is invalid\e[0m"
            exit 1
        fi
        shift;;
    --dryrun )
        DRYRUN=true
        shift;;
    * )
        ;;
esac
done

echo "Validating repositories..."
if [[ -z $PLANNERPATH ]]; then
    echo "Local Planner repo path wasn't provided, cloning from upstream to '/tmp/planner':"
    PLANNERPATH=/tmp/planner
    git clone https://github.com/fabric8-ui/fabric8-planner.git $PLANNERPATH
fi
if [[ -z $PLATFORMPATH ]]; then
    echo "Local Platform repo path wasn't provided, cloning from upstream to '/tmp/platform':"
    PLATFORMPATH=/tmp/platform
    git clone https://github.com/fabric8-ui/fabric8-ui.git $PLATFORMPATH
fi

echo "Setting up some environment variables, which ideally should be set in app as defaults..."
export FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/api/"
export FABRIC8_RECOMMENDER_API_URL="https://api-bayesian.dev.rdu2c.fabric8.io/api/v1/"
export FABRIC8_FORGE_API_URL="https://forge.api.prod-preview.openshift.io"
export FABRIC8_SSO_API_URL="https://sso.prod-preview.openshift.io/"
export FABRIC8_REALM="fabric8-test"

echo "Installing global prerequisites..."
npm install -g rimraf gulp webpack webpack-merge

cd $PLANNERPATH
if [[ $DRYRUN = true ]]
then
    echo "Dry running mock build (bypasses actual build step)..."
    mkdir -p dist
    cp package.json dist/
else
    echo "Building planner library..."
    npm install
    npm run build:library
fi

echo "Starting docker..."
service docker start

echo "Switching over to f8ui..."
cd $PLATFORMPATH

echo "Alternate build step, without using builder image, similar to f8ui/release.groovy..."
if [[ $DRYRUN = true ]]
then
    echo "Dry running mock build (bypasses actual build step)..."
    mkdir -p dist
    echo 'Mock Build' > ./dist/index.html
else
    echo "Linking planner to platform within f8ui build container..."
    npm install
    npm link $PLANNERPATH/dist

    echo "Building platform with integrated planner..."
    npm run build:prod
fi

echo "Generating f8ui integrated planner image from build artifacts..."
docker rm fabric8-planner-platform
docker rmi fabric8-planner-platform
docker build -t fabric8-planner-platform -f Dockerfile.deploy .

# echo "Running the container; visit http://localhost:8080/ on host browser..."
# docker run -it -p 8088:8080 --name=fabric8-planner-platform fabric8-planner-platform
