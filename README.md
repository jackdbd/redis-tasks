# Redis Tasks

Task lists with Express and the Node.js Redis client.

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

## Usage

Be sure that redis is running. Open a terminal and type `redis-server`. Then open another terminal and type:

```sh
npm run start
# or, if you want to use nodemon
npm run dev
```
