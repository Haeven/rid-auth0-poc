const dotenv = require("dotenv");
const express = require("express");
const https = require("https");
const logger = require("morgan");
const path = require("path");
const router = require("./routes/index");
const { auth } = require("express-openid-connect");

dotenv.load();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true,
};

config.baseURL = `https://rbauction.local:8443`;

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use("/", router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// var server = https.createServer({
// 	key: privateKey,
// 	cert: certificate,
// 	ca: certificateAuthority,
// 	ciphers: [
// 			"ECDHE-RSA-AES128-SHA256",
// 			"DHE-RSA-AES128-SHA256",
// 			"AES128-GCM-SHA256",
// 			"RC4",
// 			"HIGH",
// 			"!MD5",
// 			"!aNULL"
// 	].join(':'),
// }, app);

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err
  });
});
const fs = require("fs");

const privateKey = fs.readFileSync("certs/server.key", "utf8");
const certificate = fs.readFileSync("certs/server.crt", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

https.createServer(credentials, app).listen(8443, () => {
  console.log(`Listening on ${config.baseURL}`);
});
