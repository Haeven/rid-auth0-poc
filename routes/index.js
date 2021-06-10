var router = require('express').Router();

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: false
  });
	res.status(200);
	res.end();
});

router.get('/auth0/login', function (req, res, next) {
	const options = {
		method: 'POST',
		url: 'https://dev-ivdsn1wz.us.auth0.com/oauth/token',
		headers: { 'content-type': 'application/json' },
		body: '{"client_id":"SBZsADpFTJleFDn8CUOeX1rVXJg7zFow","client_secret":"BI-fDkgmKj4QeHP8YV62EnDpoYQBpMHiFMyFCBh7zQjQrr2B-abmrOd6ds_7n3Hr","audience":"https://dev-ivdsn1wz.us.auth0.com/api/v2/","grant_type":"client_credentials"}'
	};


console.log(req.query.username); /* eslint-disable-line */
console.log(req.query.password); /* eslint-disable-line */
  res.status(200).json({
		user_id: '01jd383hd',
		nickname: 'Haeven',
		email: 'haeven@gmail.com'
	});
  // res.render('index', {
  //   title: 'Auth0 Webapp sample Nodejs',
  //   isAuthenticated: true
  // });
});

router.get('/profile', function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(((req.oidc || {}).user) || '', null, 2),
    title: 'Profile page'
  });
});

module.exports = router;
