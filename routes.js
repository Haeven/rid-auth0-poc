const router = require('express').Router();
const database = require('./database.mock');
const Database = new database();
const paramsDictionary = {
	login         : ['username', 'password'],
	create        : ['username', 'password'],
	verify        : ['email'],
	changePassword: ['email', 'password'],
	getUser       : ['email'],
	delete        : ['id']
};


/*
	------------------------------------------------------
	API ROUTES
	------------------------------------------------------
*/

/**
	* @name Login
	* @route {GET} /auth0/login - This endpoint will be called each time a user attempts to login.
	* @param {Query String} username
	* @param {Query String} password
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {Profile Object} - https://auth0.com/docs/users/normalized-user-profile-schema
*/
router.get('/auth0/login', validateParams, function (req, res, next) {
	try {
		const userProfile = Database.loginUser(req.query.username, req.query.password);

		return res.status(200).json({
			email: userProfile.email,
			user_id: userProfile.id,
			error: false
		});
	} catch(error) {
		return res.status(500).json({ error: error.message });
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
router.get('/auth0/create', validateParams, function (req, res, next) {
	try {
		const user = { username: req.query.username, password: req.query.password }
		const userFound = Database.createUser(user);

		if (userFound) {
			return res.status(200).json({ error: 'User already exists' });
		} else {
			return res.status(200).json(null);
		}
	} catch(error) {
		return res.status(500).json({ error: error.message });
	}
});

/**
	* @name Verify
	* @route {GET} /auth0/verify - This endpoint will be called after a user that signed-up follows the "verification" link from their email.
	* @param {Query String} email
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {JSON} - Object containing error: false
*/
router.get('/auth0/verify', validateParams, function (req, res, next) {
	try {
		Database.verifyUser(req.query.email);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.status(500).json({ error: error.message });
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
router.get('/auth0/changePassword', validateParams, function (req, res, next) {
	try {
		Database.changePassword(req.query.email, req.query.password);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.status(500).json({ error: error.message });
	}
});

/**
	* @name GetUser
	* @route {GET} /auth0/getUser - This endpoint will be called to test if the user exists when the user changes their password.
	* @param {Query String} email
	* @errorReturns {JSON} - Object containing populated "error" message
	* @successReturns - {Profile Object} - https://auth0.com/docs/users/normalized-user-profile-schema
*/
router.get('/auth0/getUser', validateParams, function (req, res, next) {
	try {
		const userProfile = Database.getUser(email);

		return res.status(200).json({
			email: userProfile.email,
			user_id: userProfile.id,
			error: false
		});
	} catch(error) {
		return res.status(500).json({ error: error.message });
	}
});

/**
	* @name Delete
	* @route {GET} /auth0/delete - This endpoint will be called when a user is deleted.
	* @param {Query String} id
	* @errorReturns {Error} - Object containing populated "error" message
	* @successReturns - {JSON} - Object containing error: false
*/
router.get('/auth0/delete', validateParams, function (req, res, next) {
	try {
		Database.deleteUser(req.query.id);

		return res.status(200).json({ error: false });
	} catch(error) {
		return res.status(500).json({ error: error.message });
	}
});


/*
	------------------------------------------------------
	ROUTE MIDDLEWARE
	------------------------------------------------------
*/

/*
	NOTE: A email can be a username (e.g. Valid as a username: test@test.com ✅)
		— but a username cannot be an email (e.g. Invalid as an email: example_username ❌)
*/

// In our mock database, the username parameter is processed as an email (this will vary between integrating systems)
function validateParams(req, res, next) {
	if (req) {
		const requiredParams = paramsDictionary(req.path.replace('/auth0/'));

		if (requiredParams.every(i => i in req.query)) next()
		else return res.status(500).json({ error: `Missing parameters for ${req.path}` });
	}

	return res.status(500).json({ error: 'Invalid request' });
}

module.exports = router;
