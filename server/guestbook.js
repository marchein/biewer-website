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
		let data = [];
		for (let i = startingAt; i > (startingAt - numberOfEntrys); i--) {
			if (guestbookData.entrys[i]) {
				data.push(guestbookData.entrys[i]);
			}
		}
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
			guestbookData.entrys.push(JSON.parse(entry)); //add some data
			fs.writeFile(dataPath, JSON.stringify(guestbookData), "utf8", setupData); // write it back
		}
	});
}

module.exports = {
	setupData,
	getEntrys,
	getSpecificEntrys,
	addEntry,
	getNumberOfEntrys: function () {
		return guestbookData.entrys.length - 1;
	}
};

