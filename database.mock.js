const bcrypt = require('bcrypt');

const users = [
	{
		email: 'abella@example.com',
		id: '3b043439-720b-4ebd-9cac-290015119e9f',
		password: 'password1',
		email_verified: false
	},
	{
		email: 'mia@example.com',
		id: 'fada8e6c-7a11-4446-b387-d186d62f66d9',
		password: 'password2',
		email_verified: false
	},
	{
		email: 'lotte@example.com',
		id: 'e5585c63-7a32-4d2c-834e-a9047b0e8813',
		password: 'password3',
		email_verified: false
	},
	{
		email: 'luis@example.com',
		id: 'bdd35973-6e6e-48fe-8f7f-26355282fe69',
		password: 'password4',
		email_verified: false
	},
	{
		email: 'paolo@example.com',
		id: 'b42d4181-b632-4573-86fa-ebe9f8fd8e25',
		password: 'password5',
		email_verified: false
	}
];

class Database {
	constructor() {}

	loginUser(email, passwordAttempt) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile && bcrypt.compareSync(userProfile.password, passwordAttempt)) {
			return userProfile;
		} else {
			throw new Error('Incorrect email or password!');
		}
	}

	createUser(user) {
		const userFound = users.some(i => i.email == user.username);

		if (userFound) return null;
		else throw new Error('Username unavailable.');
	}

	verifyUser(email) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile) {
			userProfile.email_verified = true;
		} else {
			throw new Error('User not found.');
		}
	}

	changePassword(email, newPassword) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile) {
			userProfile.password = newPassword;
		} else {
			throw new Error('User not found.');
		}

		return;
	}

	getUser(email) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile) {
			return userProfile;
		} else {
			throw new Error('User not found.');
		}
	}

	deleteUser(id) {
		const userProfile = users.find(i => i.user_id == id);

		if (userProfile) {
			// delete userProfile;
		} else {
			throw new Error('User not found.');;
		}

		return;
	}
}

module.exports = Database;