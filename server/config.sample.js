const MAIL_OPTIONS = {
	host: "smtp.gmail.com",
	port: 465,
	auth: {
		type: "OAuth2",
		clientId: "",
		clientSecret: "",
		user: "",
		refreshToken: "",
		accessToken: "",
		expires: 
	}
};

const USERS = [{
	username: "user",
	password: "salted password"
}];

const LOG_FOLDER = __dirname + "/../logs";
const EXPRESS_PORT = 61015;

const GUESTBOOK_DATA = "./server/guestbook.data";

module.exports = {
	MAIL_OPTIONS,
	USERS,
	LOG_FOLDER,
	EXPRESS_PORT,
	GUESTBOOK_DATA
};
