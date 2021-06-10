const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const path = require("path");
const router = require("./routes");

dotenv.load();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/", router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
