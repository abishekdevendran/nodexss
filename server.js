/* server.js - nodexss
 *
 * Educational app to exploit XSS and defend against them using Node.JS
 *
 * October 2019
 */

'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crypt = require('crypto-js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.set('X-XSS-Protection', '0');
	var name = req.query.name;
	console.log('Received payload: ' + name);
	res.send(get_request(name));
});

app.post('/', (req, res) => {
	res.set('X-XSS-Protection', '0');
	var name = req.body.p;
	console.log('Received payload: ' + name);
	// encrypt data using AES with key as payload
	const encryptedData = crypt.AES.encrypt(
		'5URGE{1TS_C0oOkIe_T!M3}',
		name
	).toString();
	const decryptedData = crypt.AES.decrypt(
    encryptedData,
    name
  );
	// set dataToSecure as unique header
	res.set('X-DataToSecure', JSON.stringify(encryptedData));
  res.set('X-DataDecrypted', JSON.stringify(decryptedData));
	res.set('X-DataPrompt', JSON.stringify(name));
	res.send(get_request(name));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});

function get_request(name) {
	return (
		'<!DOCTYPE html>\n' +
		'<html>\n' +
		'<head>\n' +
		'<meta charset="utf-8">\n' +
		'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
		'<title>XSS labs | Defensahacker Academy</title>\n' +
		'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">\n' +
		'<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>\n' +
		'</head>\n' +
		'<body>\n' +
		"<div class='container'><section class='section'>\n" +
		"<h1 class='title'>XSS test | Defensahacker Academy - GET</h1>\n\n\n" +
		'Hello ' +
		name +
		'\n\n\n' +
		'<form method=post>\n' +
		'<div class="field">\n' +
		'<div class="control">\n' +
		'<input class=\'input is-danger\' style="width: 600px; height: 30px;" type=text name=p value="user input"/>\n' +
		'</div>\n' +
		'</div>\n' +
		"<br/>\n<input class='button is-danger' type=submit value=Send>\n" +
		'</form>\n' +
		'<hr/>\n' +
		'<h2 class="subtitle">Some examples (GET method):</h2>' +
		"<a href='/?name=World'>/?name=World</a><br/>\n" +
		"<a href='/?name=<u>World</u>'>/?name=&lt;u&gt;World&lt;/u&gt;</a>" +
		'<br/><br/>' +
		'</body>\n' +
		'</html>'
	);
}

function get_reply(name) {
	return (
		'<!DOCTYPE html>\n' +
		'<html>\n' +
		'<head>\n' +
		'<meta charset="utf-8">\n' +
		'<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
		'<title>XSS labs | Defensahacker Academy</title>\n' +
		'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">\n' +
		'<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>\n' +
		'</head>\n' +
		'<body>\n' +
		"<div class='container'><section class='section'>\n" +
		"<h1 class='title'>XSS labs | Defensahacker Academy</h1>\n" +
		'<h2>POST result:</h2>' +
		'Text received:<br/>\n\n\n' +
		"<textarea class='textarea' rows=5 cols=50>" +
		name +
		'</textarea>\n\n\n' +
		'</section></div>' +
		'</body>\n' +
		'</html>'
	);
}
