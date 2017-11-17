var express = require("express");
const path = require("path");
var app = express();
var port = process.env.PORT || 61015;
var publicFolder = path.join(__dirname, "/../public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
if (app.get("env") === "development") {
	app.locals.pretty = true;
}

app.use("/static", express.static(publicFolder));

app.get("/", function (req, res) {
	res.redirect("/index");
});

app.get("/index", function (req, res) {
	res.render("home", {
		title: "Startseite"
	});
});

app.get("/zimmer", function (req, res) {
	res.render("zimmer", {
		title: "Zimmer"
	});
});

app.get("/guestbook", function (req, res) {
	var entrys = require("./guestbook");
	res.render("guestbook", {
		title: "Gästebuch",
		data: Object.values(entrys).reverse()
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
