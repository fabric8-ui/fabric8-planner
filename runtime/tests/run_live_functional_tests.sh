#!/bin/bash
set -euo pipefail

DIR="/tmp/fabric8-test"

cleanup() {
  for key in OFFLINE_TOKEN SPACE_NAME TOKEN USER_FULL_NAME USER_ID USER_NAME FABRIC8_WIT_API_URL; do
    unset "$key";
  done

  # Remove fabric8-test repo
  rm -rf $DIR
}

# Exit handler
trap cleanup EXIT

clone_fabric8_test() {
  if [[ -d $DIR ]]; then
    log "$DIR already exists. Removing it.."
    rm -rf $DIR
  fi
  log "Cloning fabric8-test to $DIR"
  git clone https://github.com/fabric8io/fabric8-test.git $DIR
}

generate_db() {
  cd $DIR/EE_API_automation/pytest
  log "Installing all the required packages..."
  pip install pytest requests jmespath
  log "Running the EE_API_Automation Tests (DB Generation)"
  sh run_me.sh "$FABRIC8_WIT_API_URL" "$USER_NAME" "$REFRESH_TOKEN"
}

log() {
  echo
  echo -e "\e[93m============================================================"
  echo $1
  echo -e "============================================================\e[0m"
}

run_tests() {
  cd $1/../
  log "Running Planner smokeTests"
  $(npm bin)/protractor tests/protractor.config.js \
    --directConnect \
    --baseUrl="https://prod-preview.openshift.io" \
    --suite smokeTest
}

setup_environment() {
  log "Setting up required environment variables"
  eval $(cat launch_info_dump.json | ./json2env)
}

# Make sure required variables are set
validate_env() {
  err=''
  if [[ -z ${FABRIC8_WIT_API_URL+x} ]]; then
    err="$err\nFABRIC8_WIT_API_URL not set. Please set the variable and try again."
  fi
  if [[ -z ${USER_NAME+x} ]]; then
    err="$err\nUSER_NAME not set. Please set the variable and try again."
  fi
  if [[ -z ${REFRESH_TOKEN+x} ]]; then
    err="$err\nREFRESH_TOKEN not set. Please set the variable and try again."
  fi
  if [[ $err ]]; then
    echo -e "\e[31m=============================================================="
    printf "$err\n"
    echo -e "==============================================================\e[0m"
    exit
  fi
}

main() {
  SCRIPT_DIR=$(cd $(dirname "$0") && pwd)
  validate_env
  clone_fabric8_test
  generate_db
  setup_environment
  run_tests $SCRIPT_DIR
}

main "@$"
