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
			anreise: message.anreise,
			abreise: message.abreise,
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
	var bits = date.split("-");
	var d = new Date(bits[0], bits[1] - 1, bits[2]); // eslint-disable-next-line
	return d.getFullYear() == bits[0] && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[2]);
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

module.exports = {
	validate
};
