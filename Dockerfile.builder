FROM centos:7
MAINTAINER "Konrad Kleine <kkleine@redhat.com>"
ENV LANG=en_US.utf8

# Install node and wait-for-it.sh script
RUN yum install -y wget bzip2\
    && wget --quiet -O /tmp/node.tar.xz https://nodejs.org/download/release/v6.3.1/node-v6.3.1-linux-x64.tar.xz \
    && mkdir /usr/local/node \
    && tar -xJf /tmp/node.tar.xz -C /usr/local/node \
    && rm /tmp/node.tar.xz \
    && yum remove -y wget \
    && yum clean all

# Setup the app directory
ENV APP_DIR=/usr/src/app
RUN mkdir -p ${APP_DIR}

ENV PATH=${PATH}:/usr/local/node/node-v6.3.1-linux-x64/bin

WORKDIR ${APP_DIR}

RUN npm install -g bower

ENTRYPOINT ["/bin/bash"]