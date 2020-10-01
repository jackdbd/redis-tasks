FROM node:lts-buster

LABEL maintainer="jackdebidda@gmail.com"

ENV APP_DIR=/usr/src/app \
    PORT=3000

RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

COPY package.json package-lock.json ${APP_DIR}/
COPY src ${APP_DIR}/src

RUN npm ci --only=production
# RUN npm install --production

EXPOSE ${PORT}

CMD node src/app.js
