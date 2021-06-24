const { v4: uuidv4 } = require('uuid');
const router = require('express').Router();
const DatabaseMock = require('./database.mock');
const Database = new DatabaseMock();
const { requiresAuth } = require('express-openid-connect');

/*
	------------------------------------------------------
	FRONTEND ROUTES
	------------------------------------------------------
*/

router.get('/', function (req, res, next) {
	const isAuthenticated = req.oidc.isAuthenticated();
	const title = (isAuthenticated) ?
		'You are currently logged in to Demo App using your RitchieID (Auth0/SSO account)'
		: 'This is an example of a website/webapp integrated with the Ritchie Brothers new login experience using Auth0.'

  res.render('index', { title, isAuthenticated });

	next();
});

router.get('/profile', requiresAuth, function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });

	next();
});

/*
	------------------------------------------------------
	API ROUTES
	------------------------------------------------------
*/

/**
	* @name Login
	* @route {GET} /auth0/login - This endpoint will be called each time a user attempts to login.
	* @param {String} userNameOrEmail
	* @param {String} password
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {Profile Object} - https://auth0.com/docs/users/normalized-user-profile-schema
*/
router.get('/auth0/login', function (req, res, next) {
	try {
		const userProfile = Database.loginUser(req.data.userNameOrEmail, req.data.password);

		return res.status(200).send({
			email: userProfile.email,
			user_id: userProfile.id,
		}).end();
	} catch(e) {
		return res.status(200).send({ error: e.message }).end();
	}
});

/**
	* @name Create
	* @route {GET} /auth0/create - This endpoint will be called when the user signs up.
	* @param {Object} user
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {User Object} - https://auth0.com/docs/connections/database/custom-db/templates/create#user-object-example
*/
router.get('/auth0/create', function (req, res, next) {
	try {
		const user = {
			username: req.data.user.username || '',
			password: req.data.user.password,
			email: req.data.user.email || '',
			tenant: req.data.user.tenant || '',
			connection: req.data.user.connection || '',
			client_id: req.data.user.client_id || '',
			email_verified: false,
			id: uuidv4()
		};

		Database.createUser(user);

		return res.status(200).send({ user }).end();
	} catch(e) {
		return res.status(200).send({ error: e.message }).end();
	}
});

/**
	* @name Verify
	* @route {GET} /auth0/verify - This endpoint will be called after a user that signed-up follows the "verification" link from their email.
	* @param {String} email
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {JSON} - Empty Object
*/
router.get('/auth0/verify', function (req, res, next) {
	try {
		Database.verifyUser(req.data.email);

		return res.status(200).send({ }).end();
	} catch(e) {
		return res.status(200).send({ error: e.message }).end();
	}
});

/**
	* @name ChangePassword
	* @route {GET} /auth0/changePassword - This endpoint will be called when the user changes their password.
	* @param {String} email
	* @param {String} password
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {JSON} - Empty Object
*/
router.get('/auth0/changePassword', function (req, res, next) {
	try {
		Database.changePassword(req.data.email, req.data.password);

		return res.status(200).send({ }).end();
	} catch(e) {
		return res.status(200).send({ error: e.message }).end();
	}
});

/**
	* @name GetUser
	* @route {GET} /auth0/getUser - This endpoint will be called to test if the user exists when the user changes their password.
	* @param {String} email
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {Profile Object} - https://auth0.com/docs/users/normalized-user-profile-schema
*/
router.get('/auth0/getUser', function (req, res, next) {
	try {
		const userProfile = Database.getUser(req.data.email);

		return res.status(200).send({
			email: userProfile.email,
			user_id: userProfile.id
		}).end();
	} catch(e) {
		return res.status(200).send({ error: e.message }).end();
	}
});

/**
	* @name Delete
	* @route {GET} /auth0/delete - This endpoint will be called when a user is deleted.
	* @param {String} id
	* @errorReturns {Error} - Object containing populated "error" message
	* @successReturns - {JSON} - Empty Object
*/
router.get('/auth0/delete', function (req, res, next) {
	try {
		Database.deleteUser(req.data.id);

		return res.status(200).send({ }).end();
	} catch(e) {
		return res.status(200).send({ error: e.message }).end();
	}
});

module.exports = router;
