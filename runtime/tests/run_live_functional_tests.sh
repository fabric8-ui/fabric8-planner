#!/bin/bash
set -euo pipefail

DIR="/tmp/fabric8-test"

cleanup() {
  for key in OFFLINE_TOKEN SPACE_NAME TOKEN USER_FULL_NAME USER_ID USER_NAME FABRIC8_WIT_API_URL; do
    unset "$key";
  done

  rm -rf $DIR
}

trap cleanup EXIT

clone_fabric8_test() {
  if [[ -d $DIR ]]; then
    log "$DIR already exists. Removing it.."
    rm -rf $DIR
  fi
  log "Cloning fabric8-test to $DIR"
  git clone https://github.com/fabric8io/fabric8-test.git $DIR
  cd $DIR/EE_API_automation/pytest
  git fetch origin pull/375/head:pr-375 && git checkout pr-375
}

generate_db() {
  log "Installing all the required packages..."
  pip install pytest requests jmespath
  log "Running the EE_API_Tests (DB Generation)"
  sh run_me.sh "$FABRIC8_WIT_API_URL" "$USERNAME" "$REFRESH_TOKEN"
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
  env
}
main() {
  SCRIPT_DIR=$(cd $(dirname "$0") && pwd)
  clone_fabric8_test
  generate_db
  setup_environment
  run_tests $SCRIPT_DIR
}

main "@$"
