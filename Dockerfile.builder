FROM centos:7
ENV LANG=en_US.utf8

# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key" || \
    gpg --keyserver pgp.mit.edu --recv-keys "$key" || \
    gpg --keyserver keyserver.pgp.com --recv-keys "$key" ; \
  done

#ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.9.2

USER root
RUN yum -y update && \
    yum install -y bzip2 fontconfig tar java-1.8.0-openjdk nmap-ncat psmisc gtk3 git \
      python-setuptools xorg-x11-xauth wget unzip which \
      xorg-x11-server-Xvfb xfonts-100dpi \
      xorg-x11-fonts-75dpi xfonts-scalable xfonts-cyrillic \
      ipa-gothic-fonts xorg-x11-utils xorg-x11-fonts-Type1 xorg-x11-fonts-misc \
      GConf2 wget libXfont wget && \
      yum -y clean all
RUN yum install -y firefox google-chrome-stable

RUN wget "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && tar -xvf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN  wget https://github.com/mozilla/geckodriver/releases/download/v0.14.0/geckodriver-v0.14.0-linux64.tar.gz && \
  tar -xvf geckodriver-v0.14.0-linux64.tar.gz && \
  chmod +x geckodriver && \
  mv geckodriver /usr/bin

RUN npm install -g jasmine-node karma-firefox-launcher protractor

COPY google-chrome.repo /etc/yum.repos.d/google-chrome.repo
RUN yum install -y xorg-x11-server-Xvfb google-chrome-stable

ENV DISPLAY=:99
ENV FABRIC8_USER_NAME=fabric8

RUN useradd --user-group --create-home --shell /bin/false ${FABRIC8_USER_NAME}

ENV HOME=/home/${FABRIC8_USER_NAME}
ENV WORKSPACE=$HOME/fabric8-planner
RUN mkdir $WORKSPACE

RUN chmod u+s /usr/bin/Xvfb && chown fabric8 /usr/bin/Xvfb

COPY . $WORKSPACE
RUN chown -R ${FABRIC8_USER_NAME}:${FABRIC8_USER_NAME} $HOME/*

USER ${FABRIC8_USER_NAME}
WORKDIR $WORKSPACE/

VOLUME /dist

COPY docker-entrypoint.sh /home/fabric8/fabric8-planner/

# Open ports
EXPOSE 4444

ENTRYPOINT ["/home/fabric8/fabric8-planner/docker-entrypoint.sh"]
