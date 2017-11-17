var express = require("express");
const path = require('path');
var app = express();
var port = process.env.PORT || 3000;

app.set('views', 'server/views');
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('/', function(req, res) {
    res.redirect('/index');
});

app.get('/index', function(req, res){
    res.render("home", {
        title: "Startseite"
    });
});

app.get('/zimmer', function(req, res){
    res.render("zimmer", {
        title: "Zimmer"
    });
});

app.get('/guestbook', function(req, res){
    res.render("guestbook", {
        title: "Gästebuch"
    });
});

app.get('/buchen', function(req, res){
    res.render("buchen", {
        title: "Buchen"
    });
});

app.get('/impressum', function(req, res){
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