const fs = require("fs");
const moment = require("moment");
const dataPath = "./server/guestbook.json";

let guestbookData = {
	entrys: []
};

function setupData() {
	fs.readFile(dataPath, "utf8", function readFileCallback(err, data) {
		if (err) {
			console.log(err);
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
	let nextID = Object.keys(getEntrys()).length;
	let newEntry = {
		id: nextID,
		name: messageBody.name,
		ort: messageBody.wohnort,
		datum: moment().format("DD.MM.YYYY HH:mm"),
		nachricht: messageBody.nachricht
	};
	addEntry(JSON.stringify(newEntry));
}

function addEntry(entry) {
	fs.readFile(dataPath, "utf8", function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			guestbookData = JSON.parse(data); //now it an object
			guestbookData.entrys.push(JSON.parse(entry)); //add some data
			fs.writeFile(dataPath, JSON.stringify(guestbookData), "utf8", setupData); // write it back
		}
	});
}

function deleteEntry(id) {
	let validate = validEntry(id);
	if (validate.result) {
		let index = validate.position;
		if (index > -1) {
			console.log("entry with id " + id + " deleted!");
			console.log("position: " + validate.position);
			guestbookData.entrys.splice(index, 1);
			fs.writeFile(dataPath, JSON.stringify(guestbookData), "utf8", setupData); // write it back
		}
	} else {
		console.log("falsche id!");
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

