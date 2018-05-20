const config = {
	MAIL_OPTIONS: {
		host: "",
		port: 587,
		auth: {
			user: "",
			pass: ""
		},
		receiverMail: ""
	},
	USERS: [{
		username: "user",
		password: "hashed password"
	}],
	LOG_FOLDER: __dirname + "/../logs",
	EXPRESS_PORT: 61015,
	GUESTBOOK_DATA: "./server/guestbook.data",
	MYSQL: {
		host: "localhost",
		user: "root",
		password: "",
		database: "biewer"
	},
	RECAPTCHA: {
		websitekey: "",
		secret: ""
	},
	DEBUG: true
};

module.exports = {
	config
};
