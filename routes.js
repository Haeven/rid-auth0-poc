var router = require('express').Router();

const options = {
	method: 'POST',
	url: 'https://dev-ivdsn1wz.us.auth0.com/oauth/token',
	headers: { 'content-type': 'application/json' },
	body: '{"client_id":"SBZsADpFTJleFDn8CUOeX1rVXJg7zFow","client_secret":"BI-fDkgmKj4QeHP8YV62EnDpoYQBpMHiFMyFCBh7zQjQrr2B-abmrOd6ds_7n3Hr","audience":"https://dev-ivdsn1wz.us.auth0.com/api/v2/","grant_type":"client_credentials"}'
};

/*
	API ROUTES
*/
router.get('/auth0/login', function (req, res, next) {
	// req.query.username
	// req.query.password
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com',
		error: null
	});
});

router.get('/auth0/create', function (req, res, next) {
	// req.query.username
	// req.query.password
	// req.query.tenant
	// req.query.client_id
	// req.query.connection

	//Error messages:
	// user_exists
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com',
		error: null
	});
});

router.get('/auth0/verify', function (req, res, next) {
	// req.query.email
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com',
		error: null
	});
});

router.get('/auth0/changePassword', function (req, res, next) {
	// req.query.email
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com',
		error: null
	});
});

router.get('/auth0/getUser', function (req, res, next) {
	// req.query.email
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com',
		error: null
	});
});

router.get('/auth0/delete', function (req, res, next) {
	// req.query.email
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com',
		error: null
	});
});

module.exports = router;
