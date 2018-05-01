const express = require("express");
const session = require("express-session");
const efp = require("express-form-post");
const path = require("path");
const winston = require("winston");
const fs = require("fs");
const guestbook = require("./guestbook.js");
const booking = require("./booking.js");
const intern = require("./intern.js");
const config = require("./config.js");
const app = express();
const formPost = efp();
const port = process.env.PORT || config.EXPRESS_PORT;
const publicFolder = path.join(__dirname, "/../public");

if (!fs.existsSync(config.LOG_FOLDER)) {
	fs.mkdirSync(config.LOG_FOLDER);
}

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({
			name: "info-file",
			filename: config.LOG_FOLDER + "/server.log",
			level: "info"
		}),
		new (winston.transports.File)({
			name: "error-file",
			filename: config.LOG_FOLDER + "/errors.log",
			level: "error"
		})
	]
});

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "pug");
if (app.get("env") === "development") {
	app.locals.pretty = true;
}
logger.info("Setting up page rendering");

app.use((req, res, next) => {
	res.locals = {
		site: {
			title: "Pension Biewer",
			currentYear: "2017 - " + (new Date()).getFullYear(),
		},
		author: {
			name: "Marc Hein",
			site: "//marc-hein.de"
		},
		owner: {
			name: "Pension Biewer",
			site: "//pension-biewer.de"
		}
	};
	next();
});
logger.info("Setting local variables");

app.use(session({
	secret: "nevergonnagiveyouup",
	cookie: { maxAge: 60000 * 60 * 24 },
	resave: true,
	saveUninitialized: true
}));
logger.info("Setting up sessions");

guestbook.setupData();
logger.info("Setting up guestbook content");

app.use(formPost.middleware());
app.use("/static", express.static(publicFolder));

app.get("/", function (req, res) {
	res.render("home", {
		title: "Startseite"
	});
});

app.get("/index", function (req, res) {
	res.redirect("/");
});

app.get("/zimmer", function (req, res) {
	res.render("zimmer", {
		title: "Zimmer"
	});
});

app.get("/umgebung", function (req, res) {
	res.render("umgebung", {
		title: "Umgebung"
	});
});

app.get("/guestbook", function (req, res) {
	res.redirect("/guestbook/page/1");
});

app.get("/guestbook/page/:page", function (req, res) {
	let currentPage = req.params.page;
	let entrysOnPage = 5;
	let pageStartsAt = guestbook.getNumberOfEntrys() - ((currentPage - 1) * entrysOnPage);
	if (pageStartsAt >= 0) {
		res.render("guestbook", {
			title: "Gästebuch",
			data: Object.values(guestbook.getSpecificEntrys(entrysOnPage, pageStartsAt)),
			info: {
				currentPage: parseInt(currentPage),
				hasNextPage: guestbook.getNumberOfEntrys() - (currentPage * entrysOnPage) >= 0,
				hasPreviousPage: guestbook.getNumberOfEntrys() !== pageStartsAt
			}
		});
	} else {
		res.redirect("/404");
	}
});

app.post("/guestbook/page/:page", function (req, res) {
	formPost.upload(req, res, function (err) {
		if (err) {
			logger.error(err);
		}
		guestbook.getNewEntry(req.body);
		logger.info("Added new guestbook entry");
		res.redirect("/guestbook");
	});
});

app.get("/buchen", function (req, res) {
	res.render("buchen", {
		title: "Buchen",
		message: undefined
	});
});

app.post("/buchen", function (req, res) {
	let validation = booking.validate(req.body);
	if (validation.isValid) {
		booking.sendMail(validation.res);
		logger.info("Booking mail is send");
	}
	res.render("buchen", {
		title: "Buchen",
		message: validation.isValid
	});
});

app.get("/impressum", function (req, res) {
	res.render("impressum", {
		title: "Impressum"
	});
});

app.get("/datenschutz", function (req, res) {
	res.render("datenschutz", {
		title: "Datenschutzerklärung"
	});
});

app.get("/intern", function (req, res) {
	let loggedIn = req.session.loggedin;
	if (loggedIn) {
		logger.info("Successfull login");
		res.render("login", {
			title: "Interner Bereich",
			loggedin: req.session
		});
	} else {
		logger.error("Unseccessfull try to login");
		res.redirect("/login");
	}
});

app.get("/intern/guestbook/:page", function (req, res) {
	let loggedIn = req.session.loggedin;
	if (loggedIn) {
		let currentPage = req.params.page;
		let entrysOnPage = 5;
		let pageStartsAt = guestbook.getNumberOfEntrys() - ((currentPage - 1) * entrysOnPage);
		if (pageStartsAt >= 0) {
			res.render("guestbook_intern", {
				title: "Gästebuch-Verwaltung",
				data: Object.values(guestbook.getSpecificEntrys(entrysOnPage, pageStartsAt)),
				info: {
					currentPage: parseInt(currentPage),
					hasNextPage: guestbook.getNumberOfEntrys() - (currentPage * entrysOnPage) >= 0,
					hasPreviousPage: guestbook.getNumberOfEntrys() !== pageStartsAt
				}
			});
		} else {
			res.redirect("/404");
		}
	} else {
		logger.error("Unseccessfull try to go to the guestbook administration");
		res.redirect("/login");
	}
});

app.get("/intern/guestbook/delete/:id", function (req, res) {
	let loggedIn = req.session.loggedin;
	if (loggedIn) {
		let entryToBeDeleted = req.params.id;
		guestbook.deleteEntry(entryToBeDeleted);
		res.redirect("/intern/guestbook/1");
	} else {
		logger.error("Unseccessfull try to delete entry");
		res.redirect("/login");
	}
});

app.get("/login", function (req, res) {
	let loggedIn = req.session.loggedin;
	if (loggedIn) {
		res.redirect("/intern");
	} else {
		res.render("login", {
			title: "Anmelden",
			loggedin: false
		});
	}
});

app.post("/login", function (req, res) {
	let loggedin = intern.validateLogin(req.body);
	let sess = req.session;
	if (loggedin) {
		sess.username = capitalizeFirstLetter((req.body.name).toLowerCase());
		sess.loggedin = loggedin;
		logger.info(sess.username + " successfully logged in");
		res.redirect("/intern");
	} else {
		logger.error("Unseccessfull try to login by user: " + req.body.name);
		res.redirect("/login");
	}
});

app.get("/logout", function (req, res) {
	req.session.destroy(function (err) {
		if (err) {
			logger.error(err);
		} else {
			logger.info("User logged out");
			res.redirect("/");
		}
	});
});

// Handle 404 error.
app.use("*", function (req, res) {
	res.status(404).render("error", {
		title: "Fehler!",
		error: 404
	});
	//res.status(404).send("<h1>Error 404 - not found</h1>"); // not found error
});

app.listen(port, function () {
	logger.info("Express server running on port: " + port);
	console.log("Server running on port: " + port);
});

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
