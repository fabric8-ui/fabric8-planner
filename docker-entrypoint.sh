#!/bin/bash

LOGFILE=$(pwd)/functional_tests.log
echo Using logfile $LOGFILE

# For the functional tests, we are mocking the core
#export NODE_ENV=inmemory

echo "Running webdriver-manager update..."
webdriver-manager update

echo 8636d9aff3933f48b95ad94891cd1839 > /var/lib/dbus/machine-id

echo "Running Xvfb ...."
/usr/bin/Xvfb :99 -screen 0 1024x768x24 &

export DISPLAY=:99

echo "Running npm install..."
npm install

echo "Starting webdriver-manager..."
webdriver-manager start &

echo "Starting application web..."
(node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --host 0.0.0.0 --port 8088 >>$LOGFILE 2>&1 &)

echo "Running protractor..."
protractor protractor.config.js


sleep 10000
