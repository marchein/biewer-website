const fs = require("fs");
const moment = require("moment");
const winston = require("winston");
const config = require("./config.js").config;

let guestbookData = {
	entrys: []
};

if (!fs.existsSync(config.LOG_FOLDER)) {
	fs.mkdirSync(config.LOG_FOLDER);
}

var logger = winston.createLogger({
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

function setupData() {
	fs.readFile(config.GUESTBOOK_DATA, "utf8", function readFileCallback(err, data) {
		if (err) {
			logger.error(err);
		} else {
			guestbookData = JSON.parse(data); //now it an object
		}
	});
}

function getEntrys() {
	return guestbookData.entrys;
}

function getSpecificEntrys(numberOfEntrys, startingAt) {
	if (numberOfEntrys >= guestbookData.entrys.length) {
		return guestbookData.entrys;
	} else {
		let data = [];
		for (let i = startingAt; i > (startingAt - numberOfEntrys); i--) {
			if (guestbookData.entrys[i]) {
				data.push(guestbookData.entrys[i]);
			}
		}
		return data;
	}
}

function getNewEntry(messageBody) {
	let nextID = getEntrys()[getEntrys().length - 1].id + 1;
	addEntry(JSON.stringify({
		id: nextID,
		name: messageBody.name,
		ort: messageBody.wohnort,
		datum: moment().format("DD.MM.YYYY HH:mm"),
		nachricht: messageBody.nachricht
	}));
}

function addEntry(entry) {
	fs.readFile(config.GUESTBOOK_DATA, "utf8", function readFileCallback(err, data) {
		if (err) {
			logger.error(err);
		} else {
			guestbookData = JSON.parse(data); //now it an object
			let newEntry = JSON.parse(entry);
			if (isAllowed(newEntry)) {
				guestbookData.entrys.push(newEntry); //add some data
				fs.writeFile(config.GUESTBOOK_DATA, JSON.stringify(guestbookData, null, 4), "utf8", setupData); // write it back
				logger.info("Successfully added entry: " + newEntry.id);
			} else {
				logger.error("Not allowed content! Name: " + newEntry.name + " Ort: " + newEntry.ort + " Nachricht: " + newEntry.nachricht);
			}
		}
	});
}

function isAllowed(entry) {
	if (entry.name.length === 0 || entry.ort.length === 0 || entry.nachricht.length < 10) {
		return false;
	}
	let forbiddenWords = ["href", "http", "https", "buy", ".com", "newsletter"];
	var hasForbiddenWord = false;
	for (let word of forbiddenWords) {
		if (entry.name.includes(word) || entry.ort.includes(word) || entry.nachricht.includes(word)) {
			hasForbiddenWord = true;
			break;
		}
	}
	return !hasForbiddenWord;
}

function deleteEntry(id) {
	let validate = validEntry(id);
	if (validate.result) {
		let index = validate.position;
		if (index > -1) {
			guestbookData.entrys.splice(index, 1);
			fs.writeFile(config.GUESTBOOK_DATA, JSON.stringify(guestbookData, null, 4), "utf8", setupData); // write it back
			logger.info("Successfully deleted entry: " + id);
		}
	} else {
		logger.error("Cannot delete entry with id " + id);
	}
}

function validEntry(id) {
	for (let i = 0; i <= getNumberOfEntrys(); i++) {
		if (Number(guestbookData.entrys[i].id) === Number(id)) {
			return {
				result: true,
				position: i
			};
		}
	}
	return {
		result: false,
		position: -1
	};
}

function getNumberOfEntrys() {
	return guestbookData.entrys.length - 1;
}

module.exports = {
	setupData,
	getEntrys,
	getSpecificEntrys,
	getNewEntry,
	addEntry,
	deleteEntry,
	getNumberOfEntrys
};

