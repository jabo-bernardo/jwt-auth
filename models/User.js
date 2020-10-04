const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	createdAt: {
		type: String,
		required: true,
		default: () => Date.now()
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	lastLoggedIn: {
		type: String,
		required: true,
		default: () => Date.now()
	}
});

module.exports = new model('User', UserSchema);