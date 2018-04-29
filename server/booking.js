const fs = require("fs");
const winston = require("winston");
const nodemailer = require("nodemailer");
const config = require("./config.js");
const moment = require("moment");

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

const transporter = nodemailer.createTransport({
	host: config.MAIL_OPTIONS.host,
	port: config.MAIL_OPTIONS.port,
	auth: {
		user: config.MAIL_OPTIONS.auth.user,
		pass: config.MAIL_OPTIONS.auth.pass
	}
});

const PENSION_BIEWER_MAIL = "pensionbiewerockfen@t-online.de";

function validate(message) {
	let nameIsValid = validateNormalText(message.name);
	let mailIsValid = validateEmail(message.email);
	let anreiseIsValid = validateDate(message.anreise);
	let abreiseIsValid = validateDate(message.abreise);
	let numberOfPersonsIsValid = validePersons(message.personen);
	let validRoom = validateRoom(message.zimmer);
	let validText = validateAndCleanText(message.message);
	let allEntrysValid = nameIsValid && mailIsValid && anreiseIsValid && abreiseIsValid && numberOfPersonsIsValid && validRoom && validText.isValid;
	let response;
	if (allEntrysValid) {
		response = {
			name: message.name,
			email: message.email,
			anreise: parseDate(message.anreise),
			abreise: parseDate(message.abreise),
			personen: message.personen,
			zimmer: message.zimmer,
			nachricht: validText.cleanText
		};
	}
	return {
		isValid: allEntrysValid,
		res: response
	};
}

function validateNormalText(text) {
	let re = /^[a-zA-Z0-9 ]*$/;
	return re.test(text);
}

function validateEmail(email) {
	// eslint-disable-next-line
	var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
	return re.test(email);
}

function validateDate(date) {
	return moment(date).isValid();
}

function validePersons(persons) {
	return persons >= 1 && persons <= 2;
}

function validateRoom(room) {
	let rooms = ["Zimmer 1 Herrenberg", "Zimmer 2 Bockstein", "Zimmer 3 Geisberg"];
	return rooms.indexOf(room) !== -1;
}

function validateAndCleanText(text) {
	let isNotEmpty = text !== "";
	let cleanText = removeSpecials(text);
	return {
		isValid: isNotEmpty,
		cleanText: cleanText
	};
}

function removeSpecials(str) {
	return str.replace(/[<>'"&]/g, "");
}

function parseDate(date) {
	moment.locale("de");
	return moment(date).format("LL");
}

function sendMail(res) {
	var message = {
		from: `${res.name} <${res.email}>`,
		to: PENSION_BIEWER_MAIL,
		subject: `Buchungsanfrage von ${res.name} [Von: ${res.anreise} Bis ${res.abreise}]`,
		text: `Neue Anfrage von ${res.name} für den Zeitraum von ${res.anreise} bis ${res.abreise}.
		
		Gewünschtes Zimmer: ${res.zimmer}
		Anzahl der Personen: ${res.personen}
		Nachricht: ${res.nachricht}`
	};
	transporter.sendMail(message, function (error) {
		if (error) {
			logger.error(error);
		}
	});
}

module.exports = {
	validate,
	sendMail
};
