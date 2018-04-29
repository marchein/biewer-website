var express = require("express");
const path = require("path");
var guestbook = require("./guestbook.js");
var booking = require("./booking.js");
var intern = require("./intern.js");
var app = express();
var port = process.env.PORT || 61015;
var publicFolder = path.join(__dirname, "/../public");
var efp = require("express-form-post");
var formPost = efp();

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "pug");
if (app.get("env") === "development") {
	app.locals.pretty = true;
}

guestbook.setupData();

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

app.get("/guestbook", function (req, res) {
	res.redirect("/guestbook/page/1");
});

app.get("/guestbook/page/:page", function (req, res) {
	let currentPage = req.params.page;
	let entrysOnPage = 5;
	let pageStartsAt = guestbook.getNumberOfEntrys() - ((currentPage - 1) * entrysOnPage);
	if (pageStartsAt > 0) {
		res.render("guestbook", {
			title: "Gästebuch",
			data: Object.values(guestbook.getSpecificEntrys(entrysOnPage, pageStartsAt)),
			info: {
				currentPage: parseInt(currentPage),
				hasNextPage: guestbook.getNumberOfEntrys() - (currentPage * entrysOnPage) > 0,
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
			console.err(err);
		}
		guestbook.getNewEntry(req.body);
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

app.get("/login", function (req, res) {
	res.render("login", {
		title: "Anmelden",
		loggedin: false
	});
});

app.post("/login", function (req, res) {
	let loggedin = intern.validateLogin(req.body);

	res.render("login", {
		title: loggedin ? "Interner Bereich" : "Anmelden",
		loggedin: loggedin
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
	console.log("Server running on port: " + port);
});
