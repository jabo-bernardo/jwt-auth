function success(response) {
	return { success: true, response };
}

function failed(reason="Something went wrong in our end!") {
	return { success: false, reason };
}

module.exports = {
	success,
	failed
}