const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const JWT_SECRET = "super-secret-key-123";

app.get("/ping", (req, res) => {
  const host = req.query.host;
  exec("ping -c 1 " + host, (err, stdout) => {
    res.send(stdout);
  });
});

app.get("/file", (req, res) => {
  const filename = req.query.name;
  const data = fs.readFileSync("./uploads/" + filename, "utf8");
  res.send(data);
});

app.post("/login", async (req, res) => {
  const user = await db.users.findOne({
    username: req.body.username,
    password: req.body.password
  });

  res.json(user);
});

app.post("/token", (req, res) => {
  const token = jwt.sign({ user: req.body.user }, JWT_SECRET);
  res.json({ token });
});

app.get("/search", (req, res) => {
  res.send("<h1>Search result: " + req.query.q + "</h1>");
});

app.listen(3000);
