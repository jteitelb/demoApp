require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const app = express();

const cache = {};
/* 
    This was really just meant as a dummy app for playing around with docker containers.
    Don't try to learn anything about caching from this other than how not to do it. 
*/

app.use(morgan("common"));
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/double", (req, res) => {
  res.json(cache);
});

app.get("/double/:num", (req, res) => {
  if (cache.hasOwnProperty(req.params.num)) {
    res.json({ result: cache[req.params.num] });
  } else {
    try {
      let num = parseInt(req.params.num);
      let double = num * 2; // could technically error here too
      for (let i = 0; i < 1000000000; i++) {} // (slow down!)>🐢
      cache[num] = double;
      res.json({ result: double });
    } catch (err) {
      res.send("Unable to parse int");
    }
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
