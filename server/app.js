var express = require("express");
const path = require("path");
var moment = require("moment");
var guestbook = require("./guestbook.js");
var app = express();
var port = process.env.PORT || 61015;
var publicFolder = path.join(__dirname, "/../public");
var efp = require("express-form-post");
var formPost = efp();

app.set("views", path.join(__dirname, "views"));
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
	res.redirect("/guestbook/1");
});

app.get("/guestbook/:page", function (req, res) {
	let currentPage = req.params.page;
	console.log("page: " + currentPage);
	// todo add page buttons
	let entrysOnPage = 5;
	res.render("guestbook", {
		title: "Gästebuch",
		data: Object.values(guestbook.getSpecificEntrys(entrysOnPage, (currentPage - 1) * entrysOnPage)).reverse()
	});
});

app.post("/guestbook", function (req, res, next) {
	formPost.upload(req, res, function (err) {
		if (err) {
			console.log(err);
		}
		//console.log(req);
		let nextID = Object.keys(guestbook.getEntrys()).length;
		let newEntry = {
			id: nextID,
			name: req.body.name,
			ort: req.body.wohnort,
			datum: moment().format("DD.MM.YYYY HH:mm"),
			nachricht: req.body.nachricht
		};
		guestbook.addEntry(JSON.stringify(newEntry));
		res.redirect("/guestbook");
	});
});

app.get("/buchen", function (req, res) {
	res.render("buchen", {
		title: "Buchen"
	});
});

app.get("/impressum", function (req, res) {
	res.render("impressum", {
		title: "Impressum"
	});
});

// Handle 404 error.
app.use("*", function (req, res) {
	res.status(404).send("<h1>Error 404 - not found</h1>"); // not found error
});

app.listen(port, function () {
	console.log("Server running on port: " + port);
});
