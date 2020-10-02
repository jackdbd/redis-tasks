FROM node:lts-buster

LABEL maintainer="jackdebidda@gmail.com"

ENV USER_HOME=/home/app-user \
    PORT=3000 \
    NODE_VERSION=12.18.4

# Create group and user
RUN groupadd app-group && \
    useradd --gid app-group --shell /bin/bash --home-dir ${USER_HOME} --create-home app-user
USER app-user

WORKDIR ${USER_HOME}

COPY package.json package-lock.json ${USER_HOME}/
COPY src ${USER_HOME}/src

RUN npm ci --only=production
# RUN npm install --production

EXPOSE ${PORT}

CMD node src/app.js
