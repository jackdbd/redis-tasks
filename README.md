# Redis Tasks

[![Build Status](https://travis-ci.com/jackdbd/redis-tasks.svg?branch=master)](https://travis-ci.org/jackdbd/redis-tasks)

Task list with Express and the Node.js Redis client.

From Brad Traversy's course [Learn Redis from Scratch](https://www.udemy.com/learn-redis-from-scratch/learn/v4/).

## Installation

First, install Redis on your machine. If you are using Ubuntu, it should be as simple as typing:

```sh
sudo apt-get install redis-server
```

Then, install all the dependencies:

```sh
npm install
# or
npm ci
```

## Environment variables

This project requires some environment variables to be available. I use [direnv](https://github.com/direnv/direnv) and define all the required environment variables in a `.envrc` file.

## Usage

Be sure that redis is running. Open a terminal and type `redis-server`. Then open another terminal and type:

```sh
npm run start
# or, if you want to use nodemon
npm run dev
```

## Docker

This project uses docker-compose to build 2 services: webapp and redis.

Create and start all containers (rebuild Docker images every time):

```shell
docker-compose up --build
```

Stop all running containers:

```shell
docker-compose down
```

## Deployment (TODO)

I run [CapRover on a DigitalOcean droplet](https://marketplace.digitalocean.com/apps/caprover). Since [CapRover does not support docker-compose](https://caprover.com/docs/docker-compose.html), I deploy only the dockerized Node.js webapp and use a Redis one-click app available on CapRover.

Deploy the Node.js app on CapRover

```shell
caprover deploy
```

On CapRover, access to the Redis one-click app by creating a Redis client with the following syntax:

```js
const client = redis.createClient(6379, 'srv-captain--$$cap_appname' , {password: '$$cap_redis_password'})
```

## Troubleshooting

If you get `Error starting userland proxy: listen tcp 0.0.0.0:6379: bind: address already in use` when running `docker compose up`, it means that you are running a redis server on your machine and that redis server is already listening on port 6379.

You have 2 options:

1. Pick a different port for the containerized redis server: change the redis port in `docker-compose.yml`.
2. Stop the redis server on your machine: `/etc/init.d/redis-server stop` (you can restart it later with `/etc/init.d/redis-server start`).
