const config = require("./config.js").USERS;
const bcrypt = require("bcrypt");

function validateLogin(data) {
	for (var key in config) {
		if (config[key].username === (data.name).toLowerCase()) {
			return bcrypt.compareSync(data.password, config[key].password);
		}
	}
	return false;
}

module.exports = {
	validateLogin,
};
