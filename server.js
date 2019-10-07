/* server.js - nodexss
 *
 * Educational app to exploit XSS and defend against them using Node.JS
 *
 * October 2019
*/

'use strict';

const express = require('express');
const app = express();
const sanitize = require("xss");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.set("X-XSS-Protection", "0");
  var name = req.query.name;
  console.log("Received payload: "+name);
  res.send(" <!doctype html>" + 
    "<html>" + 
    "<body>" + 
    "<h1>XSS test - GET</h1>" + 
    'Hello ' + name + '\n' + 
    "<form method=post><input style=\"width: 600px; height: 30px;\" type=text name=p value=\"user input\"/><br/><input type=submit value=Send></form>" + 
    "</body>" + 
    "</html>"
    );
});

app.post('/', (req, res) => {
  res.set("X-XSS-Protection", "0");
  var name = req.body.p;
  console.log("Received payload: "+name);
  res.send("<h1>XSS test - POST</h1>Text received:<br/><textarea rows=5 cols=50>"+name+"</textarea>");
});

app.get('/patched', (req, res) => {
  res.set("X-XSS-Protection", "0");
  console.log("Received payload: "+req.query.name);
  var name = sanitize(req.query.name, {whiteList: []});
  console.log("Sanitized payload: "+name);
  res.send(" <!doctype html>" + 
    "<html>" + 
    "<body>" + 
    "<h1>XSS test - GET</h1>" + 
    'Hello ' + name + '\n' + 
    "<form method=post><input style=\"width: 600px; height: 30px;\" type=text name=p value=\"user input\"/><br/><input type=submit value=Send></form>" + 
    "</body>" + 
    "</html>"
    );
});

app.post('/patched', (req, res) => {
  res.set("X-XSS-Protection", "0");
  console.log("Received payload: "+req.body.p);
  var name = sanitize(req.body.p, {whiteList: []});
  console.log("Sanitized payload: "+name);
  res.send("<h1>XSS test - POST</h1>Text received:<br/><textarea rows=5 cols=50>"+name+"</textarea>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
