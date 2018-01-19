##
# Bash script to generate fabric8-ui image with latest planner source
# NOTE - The script assumes the user has all the required node modules in fabric8-planner and
#        fabric8-ui directory.
##
#!/bin/bash
set -e # exit immediately when a command fails

build_and_install_planner() {
    print_success "STEP 1/4 - Building planner library..."
    cd $PLANNER_PATH
    npm run build:library || {
        print_err "Failed to build fabric8-planner. Please fix the error and try again."
        exit 1
    }
    # Pack fabric8-planner into fabric8-planner@0.0.0-development.tar.gz
    package_name=$(npm pack dist)
    print_success "STEP 1/4 - Building planner library... - Done"
    install_planner "$package_name"
}

build_docker_image() {
    print_success "STEP 3/4 - Building fabric8-ui docker image..."
    cd $UI_PATH
    docker build -t fabric8-ui:test -f Dockerfile.deploy .
    print_success "STEP 3/4 - Building fabric8-ui docker image... - Done\nSuccessfully built fabric8-ui:test docker image"
}

build_ui() {
    print_success "STEP 4/4 - Building fabric8-ui library..."
    cd $UI_PATH
    npm run build:prod || {
        print_err "Failed to build fabric8-ui. Please fix the error and try again."
        exit 1
    }
    print_success "STEP 4/4 - Building fabric8-ui library... - Done"
}

install_planner() {
    print_success "STEP 2/4 - Installing new fabric8-planner into fabric8-ui..."
    cd $UI_PATH
    # Replace installed fabric8-planner with the one we just built
    npm install $PLANNER_PATH/$1 || {
        print_err "Failed to install fabric8-planner in fabric8-ui. Please fix the error and try again."
        exit 1
    }
    print_success "STEP 2/4 - Installing new fabric8-planner into fabric8-ui... - Done"
    # Remove the fabric8-planner@0.0.0-development.tar.gz file
    rm $PLANNER_PATH/$1
}

print_success() {
    GREEN="\e[32m"
    print_msg ${GREEN} "$1"
}

print_err() {
    RED="\e[31m"
    print_msg ${RED} "$1"
}

print_msg() {
    RESET="\e[0m"
    printf "\n$1======================================================================\n"
    printf "${2}\n"
    printf "======================================================================${RESET}\n"
}

validate_fabric8_ui() {
    cd $1
    # Let's validate if it contains the fabric8-ui source code
    if [[ $(npm view . name) != fabric8-ui ]]; then
        # The path doesn't contain package.json which reports to be fabric8-ui source
        print_err "Can't resolve source at provided fabric8-ui path\nPlease verify the path provided and try again"
        exit 1
    fi
}

main() {
    SCRIPT_PATH=$(readlink -f "$0")
    BASE_PATH=$(dirname "$SCRIPT_PATH")

    if [[ -z "$1" ]]; then
        print_err "No argument supplied\nUsage: ./bootstrap.sh FABRIC8_UI_PATH"
        exit 1
    fi

    # Check provided argument is fabric8-ui directory
    validate_fabric8_ui $1
    UI_PATH=$1
    PLANNER_PATH=$(dirname "$BASE_PATH")

    # Step 1 and 2 - Build planner and install it in fabric8-ui
    build_and_install_planner

    # Step 3 - Build fabric8-ui library
    build_ui

    # Step 4 - Build fabric8-ui docker image
    build_docker_image

    print_success "All steps successfully completed.\nRun the fabric8-ui image as
$ docker run -e PROXY_PASS_URL='https://api.free-int.openshift.com' -p 8080:8080 fabric8-ui:test"
}

main "$@"
