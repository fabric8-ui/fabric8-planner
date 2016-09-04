FROM node:6

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY . $HOME/almighty/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/almighty
RUN npm install && npm run build:prod

USER root

VOLUME /dist

ENTRYPOINT ["/bin/bash"]
