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
let anreise = document.getElementById("anreise");
if (anreise !== null) {
	anreise.value = today;
}
let abreise = document.getElementById("abreise");
if (abreise !== null) {
	abreise.value = inFewDays;
}

window.addEventListener("load", function () {
	window.cookieconsent.initialise({
		palette: {
			popup: {
				background: "#343a40"
			},
			button: {
				background: "#007bff"
			}
		},
		theme: "edgeless",
		position: "bottom",
		static: true,
		content: {
			message: "Diese Website nutzt Cookies, um bestmögliche Funktionalität bieten zu können.",
			dismiss: "Verstanden",
			link: "Mehr Informationen",
			href: "https://pension-biewer.de/datenschutz"
		}
	});
});
