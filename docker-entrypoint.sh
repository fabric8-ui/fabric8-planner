#!/bin/bash

LOGFILE=$(pwd)/functional_tests.log
echo Using logfile $LOGFILE

# For the functional tests, we are mocking the core
#export NODE_ENV=inmemory

echo -n Updating Webdriver and Selenium...
webdriver-manager update

echo 8636d9aff3933f48b95ad94891cd1839 > /var/lib/dbus/machine-id

echo "Running Xvfb ...."
/usr/bin/Xvfb :99 -screen 0 1024x768x24
