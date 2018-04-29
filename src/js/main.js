const moment = require("moment");

let marcEmail = document.getElementsByClassName("marc-mail")[0];
if (marcEmail !== undefined) {
	let mail = "kontakt@marc-hein.de";
	marcEmail.href = "mailto:" + mail;
	marcEmail.textContent = mail;
}

let biewerEmail = document.getElementsByClassName("biewer-mail")[0];
if (biewerEmail !== undefined) {
	let mail = "pensionbiewerockfen@t-online.de";
	biewerEmail.href = "mailto:" + mail;
	biewerEmail.textContent = mail;
}

$(document).on("click", '[data-toggle="lightbox"]', function (event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});

moment.locale("de");
var now = moment();
let today = now.format("YYYY-MM-DD");
let inFewDays = now.add(moment.duration({ days: 3 })).format("YYYY-MM-DD");
document.getElementById("anreise").value = today;
document.getElementById("abreise").value = inFewDays;
