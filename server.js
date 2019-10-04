'use strict';

const express = require('express');
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
const sanitize = require("xss");

app.get('/', (req, res) => {
  res.set("X-XSS-Protection", "0");
  var name = req.query.name;
  console.log("Received payload: "+name);
  res.send('Hello ' + name + '\n');
});

app.post('/', (req, res) => {
  res.set("X-XSS-Protection", "0");
  var name = req.query.name;
  console.log("Received payload: "+name);
  res.send('Hello ' + name + '\n');
});

app.get('/patched', (req, res) => {
  console.log("Received payload: "+req.query.name);
  var name = sanitize(req.query.name, {whiteList: []});
  console.log("Sanitized payload: "+name);
  res.send('Hello ' + name + '\n');
  console.log("Escaped payload: " + escape(name));
});

app.listen(PORT, HOST);
console.log('Running on http://'+HOST+':'+PORT);
