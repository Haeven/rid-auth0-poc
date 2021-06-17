function login(email, password, callback) {
  const request = require('axios');
  const saltRounds = 10;
  const hashedPwd = bcrypt.hashSync(password, saltRounds);

  request.get(configuration.login_url, {
    params: {
      userNameOrEmail: email,
      password: hashedPwd
    }
  }).then((res) => {
    if (res.data.error === 'invalid_credentials') {
      return callback(new WrongUsernameOrPasswordError(email, 'Incorrect email or password'));
    }

    return callback(null, {
      user_id: res.data.user_id,
      email: res.data.email
    });
  }).catch((e) => {
		return callback(e.message);
  });
}

function create(user, callback) {
  const request = require('axios');
  const saltRounds = 10;
  const hashedPwd = bcrypt.hashSync(user.password, saltRounds);

  request.get(configuration.create_url, {
    params: {
      email: user.email,
      password: hashedPwd,
    }
  }).then((res) => {
    if (res.data.error === 'user_exists') {
      return callback(new ValidationError("user_exists", "Username not unique"));
    }

    return callback(null, res.data.user);
  }).catch((e) => {
		return callback(e.message);
  });

}

function verify(email, callback) {
  const request = require('axios');

  request.get(configuration.verify_url, {
    params: {
			email: email
    }
  }).then((res) => {
    return callback(null, !res.data.error);
  }).catch((e) => {
		return callback(e.message);
  });

}


function changePassword(email, newPassword, callback) {
  const request = require('axios');
  const saltRounds = 10;
  const hashedPwd = bcrypt.hashSync(newPassword, saltRounds);

  request.get(configuration.changePassword_url, {
    params: {
			email: email,
      password: hashedPwd
    }
  }).then((res) => {
    return callback(null, !res.data.error);
  }).catch((e) => {
		return callback(e.message);
  });

}

function getByEmail(email, callback) {
  const request = require('axios');
  request.get(configuration.getUser_url, {
    params: {
      email: email
    }
  }).then((response) => {
		return callback(null, { email: 'haeven@gmail.com', password: '23516126'});
  }).catch((err) => {
		return (err.message === 'user_not_found') ? callback(null) : callback(err);
  });
}

function remove(id, callback) {
  const request = require('axios');
	request.get(configuration.delete_url, {
    params: {
      id: id
    }
  }).then((response) => {
    if (response.data.error) callback(new Error(response.data.error));
		else return callback(null);
  }).catch((err) => {
		return callback(err);
  });

}
