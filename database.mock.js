const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");

/*
	Database mock that mimics the functionality of any integrating database:

	Code used to generate the passwords originally:
		const saltRounds = 10;
		bcrypt.hashSync(USER_PASSWORD, saltRounds);

	Code used to compare passwords:
		bcrypt.compareSync(PASSWORD_ATTEMPT, '$2b$10$u.TACZdF/vlrSnsEVaj4e.3spwpRJ7GmJgPpqUGNtIwTr1RXEe37W')
*/

const users = [
	{
		email: 'abella@example.com',
		id: '3b043439-720b-4ebd-9cac-290015119e9f',
		// bcrypt.hashSync('password1', saltRounds) — result:
		password: '$2b$10$u.TACZdF/vlrSnsEVaj4e.3spwpRJ7GmJgPpqUGNtIwTr1RXEe37W',
		email_verified: false
	},
	{
		email: 'mia@example.com',
		id: 'fada8e6c-7a11-4446-b387-d186d62f66d9',
		// bcrypt.hashSync('password2', saltRounds) — result:
		password: '$2b$10$dUUvg10L1B5Pt.kljW.Xee97hKYgsf.94ktxXlwI.4DWqVP3nTLue',
		email_verified: false
	},
	{
		email: 'lotte@example.com',
		id: 'e5585c63-7a32-4d2c-834e-a9047b0e8813',
		// bcrypt.hashSync('password3', saltRounds) — result:
		password: '$2b$10$FtxJ6cNmwNmFKdNNLtGqxu4VVkRg3FDc3PrZ3i/ZbpXa5bvY98042',
		email_verified: false
	},
	{
		email: 'luis@example.com',
		id: 'bdd35973-6e6e-48fe-8f7f-26355282fe69',
		// bcrypt.hashSync('password4', saltRounds) — result:
		password: '$2b$10$S2wC43Uuede0R6WJrIZM9u6K5oZlFBXLj7NRcjeymQdRoBkPfk8e2',
		email_verified: false
	},
	{
		email: 'paolo@example.com',
		id: 'b42d4181-b632-4573-86fa-ebe9f8fd8e25',
		// bcrypt.hashSync('password5', saltRounds) — result:
		password: '$2b$10$ZKHWmB15Z6XllRJU8FF8ou4oE30epVwOr1jyReTDP79dxmHbd4VnK',
		email_verified: false
	}
];

class Database {
	constructor() {}

	loginUser(email, passwordAttempt) {
		const userProfile = users.find(i => i.email == email);
		const bytes  = CryptoJS.AES.decrypt(passwordAttempt, 'secret key 123');
		const password = bytes.toString(CryptoJS.enc.Utf8);

		if (userProfile && bcrypt.compareSync(password, userProfile.password)) {
			return userProfile;
		} else {
			throw new Error('Incorrect email or password');
		}
	}

	createUser(user) {
		const userFound = users.some(i => i.email == user.username);

		if (userFound) return null;
		else throw new Error('Username unavailable');
	}

	verifyUser(email) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile) {
			userProfile.email_verified = true;
		} else {
			throw new Error('User not found');
		}
	}

	changePassword(email, newPassword) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile) {
			userProfile.password = newPassword;
		} else {
			throw new Error('User not found');
		}

		return;
	}

	getUser(email) {
		const userProfile = users.find(i => i.email == email);

		if (userProfile) {
			return userProfile;
		} else {
			throw new Error('User not found');
		}
	}

	deleteUser(id) {
		const userProfile = users.find(i => i.user_id == id);

		if (userProfile) {
			// delete userProfile;
		} else {
			throw new Error('User not found');;
		}

		return;
	}
}

module.exports = Database;