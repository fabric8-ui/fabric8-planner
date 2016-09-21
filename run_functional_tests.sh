#!/usr/bin/env bash

LOGFILE=$(pwd)/functional_tests.log
echo Using logfile $LOGFILE 

# For the functional tests, we are mocking the core
export NODE_ENV=inmemory

# Start selenium server just for this test run
echo -n Starting Webdriver and Selenium...
(webdriver-manager start >>$LOGFILE 2>&1 &)
# Wait for port 4444 to be listening connections
while ! (ncat -w 1 127.0.0.1 4444 </dev/null >/dev/null 2>&1); do sleep 1; done
echo done.

# Start the web app
echo -n Starting Almighty development server...
(node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --host 0.0.0.0 --port 8088 >>$LOGFILE 2>&1 &)
# Wait for port 8088 to be listening connections
while ! (ncat -w 1 127.0.0.1 8088 </dev/null >/dev/null 2>&1); do sleep 1; done
echo done.

# Finally run protractor
echo Running tests...
protractor protractor.config.js

# Cleanup webdriver-manager and web app processes
fuser -k -n tcp 4444
fuser -k -n tcp 8088