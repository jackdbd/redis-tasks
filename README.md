# Redis Tasks

Task lists with Express and the Node.js Redis client.

From Brad Traversy's course [Learn Redis from Scratch](https://www.udemy.com/learn-redis-from-scratch/learn/v4/).


### Installation

First, install Redis on your machine. If you are using Ubuntu, it should be as simple as typing:

```
sudo apt-get install redis-server
```
Then, install all the dependecies:

```
git clone git@github.com:jackdbd/redis-tasks.git
cd redis-tasks
yarn install
```


### Usage

Be sure that redis is running. Open a terminal and type `redis-server`. Then open a new terminal and type:

```
yarn start
# or, if you want to use nodemon (dev dependency)
yarn dev
```