const { Schema, model } = require('mongoose');

const RefreshTokenSchema = new Schema({
	token: {
		type: String,
		required: true
	},
	refreshToken: {
		type: String,
		required: true
	}
});

module.exports = new model('RefreshToken', RefreshTokenSchema);