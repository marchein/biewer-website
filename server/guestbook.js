const fs = require("fs");
const dataPath = "./server/guestbook.json";

let guestbookData = {
	entrys: []
};

function setupData() {
	fs.readFile(dataPath, "utf8", function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		}
		else {
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
	}
	else {
		let startValue = startingAt < guestbookData.entrys.length ? startingAt : 0;
		let data = [];

		for (let i = startValue; i < (startValue + numberOfEntrys); i++) {
			if (guestbookData.entrys[i]) {
				data.push(guestbookData.entrys[i]);
			}
		}
		// todo show last entrys on last page
		return data;
	}
}

function addEntry(entry) {
	fs.readFile(dataPath, "utf8", function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		}
		else {
			guestbookData = JSON.parse(data); //now it an object
			console.log(guestbookData);
			guestbookData.entrys.push(JSON.parse(entry)); //add some data
			let json = JSON.stringify(guestbookData); //convert it back to json
			fs.writeFile(dataPath, json, "utf8", null); // write it back
		}
	});
}

module.exports = {
	setupData,
	getEntrys,
	getSpecificEntrys,
	addEntry
};

