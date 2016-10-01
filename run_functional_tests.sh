#!/usr/bin/env bash

LOGFILE=$(pwd)/functional_tests.log
echo Using logfile $LOGFILE 

# Default value is netcat for linux
# For MAC the value should be nc
nc_cmd='netcat'
is_mac=false
if [ "$(uname)" == "Darwin" ]; then
  echo "MAC OS Found"
  nc_cmd='nc'
  is_mac=true
fi

# For the functional tests, we are mocking the core
export NODE_ENV=inmemory

# Download dependencies
echo -n Updating Webdriver and Selenium...
node_modules/protractor/bin/webdriver-manager update
# Start selenium server just for this test run
echo -n Starting Webdriver and Selenium...
(node_modules/protractor/bin/webdriver-manager start >>$LOGFILE 2>&1 &)
# Wait for port 4444 to be listening connections

while ! (`$nc_cmd -w 1 127.0.0.1 4444 </dev/null >/dev/null 2>&1`); do sleep 1; done
echo done.

# Start the web app
echo -n Starting Almighty development server...
(node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --host 0.0.0.0 --port 8088 >>$LOGFILE 2>&1 &)
# Wait for port 8088 to be listening connections
while ! (`$nc_cmd -w 1 127.0.0.1 8088 </dev/null >/dev/null 2>&1`); do sleep 1; done
echo done.

# Finally run protractor
echo Running tests...
node_modules/protractor/bin/protractor protractor.config.js
TEST_RESULT=$?

# Cleanup webdriver-manager and web app processes
if [ is_mac ]; then
  kill -9 $(lsof -ti tcp:8088)
  kill -9 $(lsof -ti tcp:4444)
else
  fuser -k -n tcp 4444
  fuser -k -n tcp 8088
fi

# Return test result
if [ $TEST_RESULT -eq 0 ]; then
  echo 'Functional tests OK'
  exit 0
else
  echo 'Functional tests FAIL'
  exit 1
fi
