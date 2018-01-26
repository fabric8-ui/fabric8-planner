#!/usr/bin/env bash

webdriver_running() {
  curl --output /dev/null --silent --head --fail 127.0.0.1:4444
}

wait_for_webdriver() {
  echo "Waiting for the webdriver to start "
  # Wait for port 4444 to be listening connections
  until webdriver_running ; do
    sleep 1
    echo -n .
  done
  echo
  echo "Webdriver manager up and running - OK"
  echo
}

start_webdriver() {
  # Update webdriver
  echo "Updating Webdriver and Selenium..."
  npm run webdriver:update
  # Start selenium server just for this test run
  echo "Starting Webdriver and Selenium..."
  npm run webdriver:start >> /dev/null 2>&1 &
}

main() {
  local base_url=${BASE_URL:-"http://localhost:8080/"}
  local temp_dir=${TEMP_DIR:-$(mktemp -d)}
  local specs_pattern=${SPECS_PATTERN:-"${temp_dir}/**/*.spec.js"}
  local test_source_path=${TEST_SOURCE_PATH:-"example-test-src"}
  local access_token=${ACCESS_TOKEN:-"{\"access_token\":\"somerandomtoken\",\"expires_in\":1800,\"refresh_expires_in\":1800,\"refresh_token\":\"somerandomtoken\",\"token_type\":\"bearer\"}"}
  local protractor="$(npm bin)/protractor"
  local typescript="$(npm bin)/tsc"
  local suite=${1:-fullTest}

  echo "Getting local dependencies.."
  npm install

  echo "Using ${temp_dir} as working directory"

  if [[ -z ${TEST_SOURCE_PATH+x} ]]; then
    echo "TEST_SOURCE_PATH is not set, using ${test_source_path}"
  fi

  # Compile tests and base files
  echo "Compiling tests.."
  ${typescript} --outDir "${temp_dir}" --project "${test_source_path}"
  ${typescript} --outDir "${temp_dir}" --project "."

  echo "Getting test context dependencies.."
  cp "package.json" "${temp_dir}/"
  cd "${temp_dir}" && npm install

  echo "Using base url ${base_url}"
  echo "Using token ${access_token}"

  if [[ ${DIRECT_CONNECT:-false} == false ]]; then
    echo "DIRECT_CONNECT not set; Using webdriver. Tests may run slow .. checking webdriver status"
    echo
    webdriver_running || {
      start_webdriver
      wait_for_webdriver
    }
  else
    echo "DIRECT_CONNECT is set; using direct connection (faster)"
    echo
  fi

  if [[ ${HEADLES_MODE:-false} == true ]]; then
    echo "HEADLESS_MODE is set. Chrome will run in headless mode"
    echo
  fi

  #$protractor --baseUrl "${base_url}" "tmp/protractor.conf.js" --suite "${suite}"
  $protractor --baseUrl "${base_url}" --specs "${specs_pattern}" --exclude "node_modules/**/*.spec.js" --params.accessToken "${access_token}" "${temp_dir}/protractor.conf.js"

  TEST_RESULT=$?

  # Return test result
  if [ $TEST_RESULT -eq 0 ]; then
    echo 'Functional tests OK'
    exit 0
  else
    echo 'Functional tests FAIL'
    exit 1
  fi

  # Note: we do not shutdown Selenium/Webdriver because clean shutdown is not supported anymore 
  # with Selenium 3 standalone. See https://github.com/angular/webdriver-manager/issues/199
  # Running instances will be re-used when restarting the tests.
}

main "$@"
