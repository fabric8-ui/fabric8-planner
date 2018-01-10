FROM centos:7
ENV LANG=en_US.utf8

ENV NODE_VERSION 8.3.0

RUN yum -y update && \
    yum install -y bzip2 tar git \
    yum -y clean all

ENV FABRIC8_USER_NAME=fabric8

RUN useradd --user-group --create-home --shell /bin/false ${FABRIC8_USER_NAME}

ENV HOME=/home/${FABRIC8_USER_NAME}
ENV WORKSPACE=$HOME/fabric8-planner
RUN mkdir $WORKSPACE

COPY . $WORKSPACE
RUN chown -R ${FABRIC8_USER_NAME}:${FABRIC8_USER_NAME} $HOME/*

USER ${FABRIC8_USER_NAME}
WORKDIR $WORKSPACE/

VOLUME /dist

# ENTRYPOINT ["/home/fabric8/fabric8-planner/docker-entrypoint.sh"]