const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { success, failed } = require('../utils/response');
const {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET
} = process.env;

const TOKEN_EXPIRE_IN = '15s';

async function loginUser(req, res) {
	
	const {
		email,
		password
	} = req.body;

	if(!email) return res.json(failed(`Email is required!`));
	if(!password) return res.json(failed(`Password is required!`));

	const user = await User.findOne({ email: email });
	if(!user) return res.json(failed(`Unable to find that user!`));

	const didPasswordMatch = await bcrypt.compareSync(password, user.password);
	if(!didPasswordMatch) return res.json(failed(`Password did not match!`));

	const accessToken = jwt.sign({ user: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE_IN });
	const refreshToken = jwt.sign({ accessToken }, REFRESH_TOKEN_SECRET);

	const dataRef = new RefreshToken({ refreshToken, token: accessToken });
	dataRef.save()
		.then(token => {
			return res.json({
				accessToken,
				refreshToken
			})
		})
		.catch(err => {
			console.error(err);
			res.json(failed());
		})

}

async function registerUser(req, res) {

	const {
		email, 
		password,
		username
	} = req.body;

	if(!email) return res.json(failed(`Email is required!`));
	if(!password) return res.json(failed(`Password is required!`));
	if(!username) return res.json(failed(`Username is required!`));

	const encryptedPassword = await bcrypt.hashSync(password, 12);

	const user = new User({
		email,
		password: encryptedPassword,
		username
	});

	user.save()
		.then(registeredUser => {
			res.json(success(registeredUser));
		})
		.catch(err => {
			res.json(failed());
			console.error(err);
		})

}

async function logoutUser(req, res) {
	const {
		token
	} = req.body;
	if(!token) return res.json(failed(`Invalid token!`));
	await RefreshToken.deleteOne({ token: token })
	res.json(success(`Logged out!`));
}

async function renewUserAccess(req, res) {
	const {
		refreshToken
	} = req.body;
	if(!refreshToken) return res.json(failed('Invalid token!'));
	const token = await RefreshToken.findOne({ refreshToken });
	const oldContentPayload = jwt.decode(token.token);
	if(!token) res.json(failed('Token already expired!'));
	const newAccessToken = jwt.sign({user: oldContentPayload.user}, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE_IN });
	return res.json(success({ accessToken: newAccessToken }))
}

module.exports = {
	loginUser,
	registerUser,
	logoutUser,
	renewUserAccess
}