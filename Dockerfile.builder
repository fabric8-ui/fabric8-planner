FROM centos:7
MAINTAINER "Konrad Kleine <kkleine@redhat.com>"
ENV LANG=en_US.utf8

# Bower wants /home/almighty for what ever reason
ENV APP_DIR=/home/almighty/source

# Install node and wait-for-it.sh script
RUN yum install -y wget bzip2 git\
    && wget --quiet -O /tmp/node.tar.xz https://nodejs.org/download/release/v6.3.1/node-v6.3.1-linux-x64.tar.xz \
    && mkdir /usr/local/node \
    && tar -xJf /tmp/node.tar.xz -C /usr/local/node \
    && rm /tmp/node.tar.xz \
    && yum remove -y wget \
    && yum clean all

# Create a non-root user and a group with the same name: "almighty"
ENV ALMIGHTY_USER_NAME=almighty
RUN useradd -s /bin/bash ${ALMIGHTY_USER_NAME}

ENV PATH=${PATH}:/usr/local/node/node-v6.3.1-linux-x64/bin

RUN npm install -g bower

# From here onwards, any RUN, CMD, or ENTRYPOINT will be run under the following user
USER ${ALMIGHTY_USER_NAME}

# Setup the app directory
RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

ENTRYPOINT ["/bin/bash"]