const fs = require("fs");
const winston = require("winston");
const nodemailer = require("nodemailer");
const config = require("./config.js").config;
const moment = require("moment");

if (!fs.existsSync(config.LOG_FOLDER)) {
	fs.mkdirSync(config.LOG_FOLDER);
}

var logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({
			format: "DD.MM.YYYY - HH:mm:ss"
		}),
		winston.format.printf(info => `[${info.timestamp}] - [${info.level}]: ${info.message}`)
	),
	transports: [
		new (winston.transports.File)({
			name: "info-file",
			filename: config.LOG_FOLDER + "/server.log",
			level: "info",
			timestamp: true
		}),
		new (winston.transports.File)({
			name: "error-file",
			filename: config.LOG_FOLDER + "/errors.log",
			level: "error",
			timestamp: true
		})
	]
});

const transporter = nodemailer.createTransport({
	host: config.MAIL_OPTIONS.host,
	port: config.MAIL_OPTIONS.port,
	secure: config.MAIL_OPTIONS.secure,
	auth: {
		user: config.MAIL_OPTIONS.auth.user,
		pass: config.MAIL_OPTIONS.auth.pass
	}
});

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
	let rooms = ["Zimmer Herrenberg", "Zimmer Bockstein", "Zimmer Geisberg"];
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
		//from: `${res.name} <${res.email}>`,
		from: `${res.name} <${res.email}>`,
		//to: config.MAIL_OPTIONS.receiverMail,
		to: "dev@marc-hein.de",
		replyTo: res.email,
		subject: `Buchungsanfrage von ${res.name} [Von: ${res.anreise} Bis ${res.abreise}]`,
		text: `Neue Anfrage von ${res.name} für den Zeitraum von ${res.anreise} bis ${res.abreise}.\nGewünschtes Zimmer: ${res.zimmer}\nAnzahl der Personen: ${res.personen}\nNachricht: ${res.nachricht}`,
		auth: {
			user: config.MAIL_OPTIONS.auth.user,
			pass: config.MAIL_OPTIONS.auth.pass
		}
	};
	transporter.sendMail(message, function (error) {
		if (error) {
			logger.error(error);
		} else {
			logger.info(`Booking mail is send: sender: ${res.name} (${res.email}) timeframe: ${res.anreise} - ${res.abreise}, room: ${res.zimmer}, number of people: ${res.personen}, message: ${res.nachricht.replace(/\n|\r/g, " ")}`);
		}
	});
}

module.exports = {
	validate,
	sendMail
};
