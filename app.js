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
  client.lrange("tasks", 0, -1, function(err, reply) {
    res.render("index", {
      title,
      tasks: reply
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
    console.log("Task added");
    res.redirect("/");
  });
});

const PORT = 3000;
app.listen(PORT);
console.log(`Express server started on port ${PORT}`);

module.exports = app;
