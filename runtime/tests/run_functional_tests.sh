#!/usr/bin/env bash

declare -r SCRIPT_DIR=$(cd $(dirname "$@" ) && pwd)/tests
source "$SCRIPT_DIR/lib/common.inc.sh"

main() {

  # BASE_URL is set means planner is already running.
  # Start planner only if BASE_URL is not set
  if [[ -z ${BASE_URL+x} ]]; then
    echo "Starting Planner in inmemory mode"
    start_planner
    wait_for_planner
  fi

  cd ../tests
  export BASE_URL="http://localhost:8088/"
  export TEST_SOURCE_PATH="../src/tests"
  npm test

}

main "$@"


