const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const routes = require('./routes');
const port = process.env.PORT || 3000;

const app = express().use('/', routes);

const jwtCheck = jwt({
		secret: jwks.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: 'https://dev-ivdsn1wz.us.auth0.com/.well-known/jwks.json'
		}),
		audience: 'https://rid-auth0-poc.herokuapp.com/auth0/',
		issuer: 'https://dev-ivdsn1wz.us.auth0.com/',
		algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
	res.send('Secured Resource');
});

app.listen(port);
