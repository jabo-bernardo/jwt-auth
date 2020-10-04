const { Router } = require('express');
const router = new Router();
const {
	registerUser,
	loginUser,
	logoutUser,
	renewUserAccess
} = require('../controllers/users-controller');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.delete('/logout', logoutUser);
router.post('/renew', renewUserAccess);

module.exports = router;