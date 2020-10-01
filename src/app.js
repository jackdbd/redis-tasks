const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();

["PORT", "REDIS_HOST", "REDIS_PORT"].forEach((k) => {
  if (process.env[k] === undefined) {
    throw new Error(`${k} not set`);
  }
});

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  password: process.env.REDIS_PASSWORD
});

client.on('connect', function () {
  console.log('Redis server connected');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger(process.env.LOGGER_FORMAT || 'common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// TODO: move these controllers to their home module and make them accept a
// redis client with a function like `makeAPI`.

const onHome = (req, res) => {
  const title = 'Task List';
  client.lrange('tasks', 0, -1, function (err, tasks) {
    console.log('=== err, tasks ===', err, tasks);
    if (err) {
      throw err;
    }
    client.hgetall('call', function (err, call) {
      console.log('=== err, call ===', err, call);
      if (err) {
        throw err;
      }
      console.log('=== title ===', title);
      console.log('=== tasks ===', tasks);
      res.render('index', {
        title,
        tasks,
        call
      });
    });
  });
};

const onTaskAdd = (req, res) => {
  const task = req.body.task;
  client.rpush('tasks', task, function (err, reply) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(`Task added: ${task}`);
    res.redirect('/');
  });
};

const onTaskDelete = (req, res) => {
  const tasksToDelete = req.body.tasks;
  client.lrange('tasks', 0, -1, function (err, tasks) {
    if (err) {
      console.log(err);
      throw err;
    }
    for (let i = 0; i < tasks.length; i++) {
      if (tasksToDelete.indexOf(tasks[i]) > -1) {
        client.lrem('tasks', 0, tasks[i], function (err, reply) {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log(`Task deleted: ${tasks[i]}`);
        });
      }
    }
    res.redirect('/');
  });
};

const onCallAdd = (req, res) => {
  const { name, company, phone, time } = req.body;
  const newCall = {
    name,
    company,
    phone,
    time
  };

  client.hmset(
    'call',
    [
      'name',
      newCall.name,
      'company',
      newCall.company,
      'phone',
      newCall.phone,
      'time',
      newCall.time
    ],
    function (err, reply) {
      if (err) {
        throw err;
      }
      console.log('Add new call');
      res.redirect('/');
    }
  );
};

app.get('/', onHome);
app.post('/task/add', onTaskAdd);
app.post('/task/delete', onTaskDelete);
app.post('/call/add', onCallAdd);

app.listen(process.env.PORT);
console.log(`Express server started on port ${process.env.PORT}`);

module.exports = app;
