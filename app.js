const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const redis = require("redis");

const app = express();

// redis-server must be running on this machine.
const client = redis.createClient();
client.on("connect", function() {
  console.log("Redis server connected");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  const title = "Task List";
  client.lrange("tasks", 0, -1, function(err, tasks) {
    if (err) {
      throw err;
    }
    client.hgetall("call", function(err, call) {
      if (err) {
        throw err;
      }
      res.render("index", {
        title,
        tasks,
        call
      });
    });
  });
});

app.post("/task/add", function(req, res) {
  const task = req.body.task;
  client.rpush("tasks", task, function(err, reply) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(`Task added: ${task}`);
    res.redirect("/");
  });
});

app.post("/task/delete", function(req, res) {
  const tasksToDelete = req.body.tasks;
  client.lrange("tasks", 0, -1, function(err, tasks) {
    if (err) {
      console.log(err);
      throw err;
    }
    for (let i = 0; i < tasks.length; i++) {
      if (tasksToDelete.indexOf(tasks[i]) > -1) {
        client.lrem("tasks", 0, tasks[i], function(err, reply) {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log(`Task deleted: ${tasks[i]}`);
        });
      }
    }
    res.redirect("/");
  });
});

app.post("/call/add", function(req, res) {
  const { name, company, phone, time } = req.body;
  const newCall = {
    name,
    company,
    phone,
    time
  };
  client.hmset(
    "call",
    [
      "name",
      newCall.name,
      "company",
      newCall.company,
      "phone",
      newCall.phone,
      "time",
      newCall.time
    ],
    function(err, reply) {
      if (err) {
        throw err;
      }
      console.log("Add new call");
      res.redirect("/");
    }
  );
});

const PORT = 3000;
app.listen(PORT);
console.log(`Express server started on port ${PORT}`);

module.exports = app;
