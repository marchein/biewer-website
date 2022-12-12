var lightbox = require("bs5-lightbox");

let biewerEmail = document.getElementsByClassName("biewer-mail")[0];
if (biewerEmail !== undefined) {
	let name = "kontakt";
	let domain = "pension-biewer.de";
	let mail = name + "@" + domain;
	biewerEmail.href = "mailto:" + mail;
	biewerEmail.textContent = mail;
}


for (const el of document.querySelectorAll('.lightbox')) {
  el.addEventListener('click', lightbox.initialize)
}
