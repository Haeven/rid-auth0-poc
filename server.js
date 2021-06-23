const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes');

const jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://dev-ritchieid.us.auth0.com/.well-known/jwks.json'
	}),
	audience: 'https://rid-auth0-poc.herokuapp.com/auth0/',
	issuer: 'https://dev-ritchieid.us.auth0.com/',
	algorithms: ['RS256']
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', router);

app.use(jwtCheck);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

const port = process.env.PORT || 3000;

http.createServer(app)
  .listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });
