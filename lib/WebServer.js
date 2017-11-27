"use strict";

// *** PUBLIC LIBRARIES ***
const expressServer = require('express');						// http://expressjs.com/en
const http = require('http');									// https://nodejs.org/api/http.html
const env = require('node-env-file');							// https://github.com/grimen/node-env-file
const bodyParser = require('body-parser');						// https://www.npmjs.com/package/body-parser

// Advanced Parsers
const xmlparser = require('express-xml-bodyparser');			// https://www.npmjs.com/package/express-xml-bodyparser
const multer = require('multer');								// https://www.npmjs.com/package/multer
const xml2js = require('xml2js');								// https://www.npmjs.com/package/xml2js

// Other
// var queryString = require('query-string');					// https://www.npmjs.com/package/query-string
// var util = require('util');									// https://nodejs.org/api/util.html


// *** PARSERS
exports.parseUrlEncoded = bodyParser.urlencoded({extended:false});		// URLEncoded
exports.parseJson = bodyParser.json();									// JSON
exports.parseRaw = bodyParser.raw();									// BINARY
exports.parseText = bodyParser.text({type:'*/*'});						// TEXT
exports.parseXML = xmlparser({trim: false, explicitArray: false});		// XML
exports.parseFormWithAttachments = multer();							// Forms with attachments
exports.convertXml2Json = function(xmlData, callback) {					// Converts XML to JSON
	var xml2jsOptions = {
		normalizeTags: true,
		normalize: true,
		explicitArray: false
	};
	xml2js.parseString(xmlData, xml2jsOptions, callback);
}

// *** BUILD SERVER
exports.build = function() {
	// Initialize server
	var app = expressServer();
	app.set('view engine', 'ejs');
	app.use(expressServer.static(__dirname + '/../public'));
	
	// Create the webserver
	var port = process.env.PORT || 5000;
	http.createServer(app).listen(port);

	// Reads configuration from .env, if file does not exist then display warning
	try {
		env(__dirname + '/../env');
		console.log("ENV: " + process.env.LOCATION);
	} catch (e) {
		console.log("The file 'env' was not found, so no settings were loaded");
	}

	console.log("The server is running in port " + port);
	
	return app;
}