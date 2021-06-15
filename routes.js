const router = require('express').Router();
const database = require('./database.mock');
const Database = new database();


/*
	------------------------------------------------------
	API ROUTES
	------------------------------------------------------
*/

/**
	* @name Login
	* @route {GET} /auth0/login - This endpoint will be called each time a user attempts to login.
	* @param {Query String} userNameOrEmail
	* @param {Query String} password
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {Profile Object} - https://auth0.com/docs/users/normalized-user-profile-schema
*/
router.get('/auth0/login', function (req, res, next) {
	try {
		validateParams(req, res);
		const userProfile = Database.loginUser(req.query.userNameOrEmail, req.query.password);

		return res.status(200).json({
			email: userProfile.email,
			user_id: userProfile.id,
			error: false
		});
	} catch(error) {
		return res.send(error).status(500);
	}
});

/**
	* @name Create
	* @route {GET} /auth0/create - This endpoint will be called when the user signs up.
	* @param {Query String} username
	* @param {Query String} password
	* @param {Query String} ?tenant
	* @param {Query String} ?client_id
	* @param {Query String} ?connection
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {User Object} - https://auth0.com/docs/connections/database/custom-db/templates/create#user-object-example
*/
router.get('/auth0/create', function (req, res, next) {
	try {
		validateParams(req, res);
		const user = { username: req.query.username, password: req.query.password }
		Database.createUser(user);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.json({ error: error.message }).status(500);
	}
});

/**
	* @name Verify
	* @route {GET} /auth0/verify - This endpoint will be called after a user that signed-up follows the "verification" link from their email.
	* @param {Query String} email
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {JSON} - Object containing error: false
*/
router.get('/auth0/verify', function (req, res, next) {
	try {
		validateParams(req, res);
		Database.verifyUser(req.query.email);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.json({ error: error.message }).status(500);
	}
});

/**
	* @name ChangePassword
	* @route {GET} /auth0/changePassword - This endpoint will be called when the user changes their password.
	* @param {Query String} email
	* @param {Query String} password
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {JSON} - Object containing error: false
*/
router.get('/auth0/changePassword', function (req, res, next) {
	try {
		validateParams(req, res);
		Database.changePassword(req.query.email, req.query.password);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.json({ error: error.message }).status(500);
	}
});

/**
	* @name GetUser
	* @route {GET} /auth0/getUser - This endpoint will be called to test if the user exists when the user changes their password.
	* @param {Query String} email
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {Profile Object} - https://auth0.com/docs/users/normalized-user-profile-schema
*/
router.get('/auth0/getUser', function (req, res, next) {
	try {
		validateParams(req, res);
		const userProfile = Database.getUser(email);

		return res.status(200).json({
			email: userProfile.email,
			user_id: userProfile.id,
			error: false
		});
	} catch(error) {
		return res.json({ error: error.message }).status(500);
	}
});

/**
	* @name Delete
	* @route {GET} /auth0/delete - This endpoint will be called when a user is deleted.
	* @param {Query String} id
	* @errorReturns {Error} - Object containing populated "error" message
	* @successReturns - {JSON} - Object containing error: false
*/
router.get('/auth0/delete', function (req, res, next) {
	try {
		validateParams(req, res);
		Database.deleteUser(req.query.id);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.json({ error: error.message }).status(500);
	}
});


/*
	------------------------------------------------------
	ROUTE MIDDLEWARE
	------------------------------------------------------
*/

const requiredParamsDictionary = {
	login         : ['userNameOrEmail', 'password'],
	create        : ['username', 'password'],
	changePassword: ['email',    'password'],
	verify        : ['email'],
	getUser       : ['email'],
	delete        : ['id']
};

/*
	NOTE: A email can be a username (e.g. Valid as a username: test@test.com ✅)
		— but a username cannot be an email (e.g. Invalid as an email: example_username ❌)
*/

// In our mock database, the username parameter is processed as an email (this will vary between integrating systems)
function validateParams(req, res) {
	const requiredParams = requiredParamsDictionary[req.path.replace('/auth0/', '')];

	if (requiredParams.every(i => i in req.query)) return;
	else res.json({ error: `Missing parameters for ${req.path}` }).status(500);
}

module.exports = router;
