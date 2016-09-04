#!/bin/bash


yum install -y wget bzip2
wget --quiet -O /tmp/node.tar.xz https://nodejs.org/download/release/v6.3.1/node-v6.3.1-linux-x64.tar.xz
wget --quiet -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
mkdir /usr/local/node
tar -xJf /tmp/node.tar.xz -C /usr/local/node

PATH=${PATH}:/usr/local/node/node-v6.3.1-linux-x64/bin

npm cache clean
rm -rf node_modules
npm install
npm run build:prod

# insert docker build here
# insert docker push here 
