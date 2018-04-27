let htmlToJson = require("html-to-json");

function getGuestBookEntrys() {
	return htmlToJson.request({
		uri: "http://gb.webmart.de/gb.cfm?id=1212428"
	}, {
		entrys: [".wmentrybox1", {
			id: function (content) {
				return content;
			}
		}]
	});
}

console.log(getGuestBookEntrys().then((data) => {
	console.log(data.entrys);
}));
