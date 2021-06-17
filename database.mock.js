const bcrypt = require('bcrypt');

const users = [
	{
		email: 'test@mock.com',
		id: '3b043439-720b-4ebd-9cac-290015119e9f',
		password: 'password1',
		email_verified: false
	},
	{
		email: 'mia@example.com',
		id: 'fada8e6c-7a11-4446-b387-d186d62f66d9',
		password: 'password2',
		email_verified: true
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

class DatabaseMock {
	constructor() {
		this.users = users;
	}

	loginUser(email, pwdAttempt) {
		const userProfile = this.users.find(i => i.email == email);

		if (userProfile) {
			const authenticated = (userProfile.password == pwdAttempt || bcrypt.compareSync(userProfile.password, pwdAttempt));

			if (authenticated) return userProfile;
			else throw new Error('invalid_credentials');
		} else {
			throw new Error('user_not_found');
		}
	}

	createUser(user) {
		const userExists = this.users.some(i => (i.email == user.email) || (i.username == user.username));

		if (!userExists) {
			this.users.push(user);

			return user;
		} else {
			throw new Error('user_exists');
		}
	}

	verifyUser(email) {
		const userProfile = this.users.find(i => i.email == email);

		if (userProfile) userProfile.email_verified = true;
		else throw new Error('user_not_found');

		return;
	}

	changePassword(email, newPassword) {
		const userProfile = this.users.find(i => i.email == email);

		if (userProfile) userProfile.password = newPassword;
		else throw new Error('user_not_found');

		return;
	}

	getUser(email) {
		const userProfile = this.users.find(i => i.email == email);

		if (userProfile) return userProfile;
		else throw new Error('user_not_found');
	}

	deleteUser(id) {
		const userIndex = this.users.findIndex(i => i.user_id == id);

		if (userIndex > -1) return this.users.splice(userIndex, 1);
		else throw new Error('user_not_found');
	}
}

module.exports = DatabaseMock;