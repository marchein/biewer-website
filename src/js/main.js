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
