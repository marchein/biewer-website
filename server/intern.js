const config = require("./config.js").USERS;

function validateLogin(data) {
	let success = false;
	for (var key in config) {
		if (config[key].username === data.name) {
			if (config[key].password === data.password) {
				success = true;
			}
		}
	}
	return success;
}

module.exports = {
	validateLogin
};
