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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function encryptStringWithXORtoHex(input, key) {
	var c = '';
	while (key.length < input.length) {
		key += key;
	}
	for (var i = 0; i < input.length; i++) {
		var value1 = input[i].charCodeAt(0);
		var value2 = key[i].charCodeAt(0);

		var xorValue = value1 ^ value2;

		var xorValueAsHexString = xorValue.toString('16');

		if (xorValueAsHexString.length < 2) {
			xorValueAsHexString = '0' + xorValueAsHexString;
		}

		c += xorValueAsHexString;
	}
	return c;
}

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
  const data='5URGE{1TS_C0oOkIe_T!M3}';
  //encrypt data to openssl standard
  const encryptedDataHex=encryptStringWithXORtoHex(data,name);
	res.set('X-DataToSecure', encryptedDataHex);
	res.set('X-DataPrompt', name);
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
		'<title>Totally Normal Landing Page</title>\n' +
		'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">\n' +
		'<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>\n' +
		'</head>\n' +
		'<body>\n' +
		"<div class='container'><section class='section'>\n" +
		"<h1 class='title'>Totally Normal Landing Page</h1>\n\n\n" +
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
		'<br/><br/>' +
		'</body>\n' +
		'</html>'
	);
}
