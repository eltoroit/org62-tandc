"use strict";

// *** PUBLIC LIBRARIES ***
const expressServer = require('express');															// http://expressjs.com/en
const http = require('http');																					// https://nodejs.org/api/http.html
const env = require('node-env-file');																	// https://github.com/grimen/node-env-file
const bodyParser = require('body-parser');														// https://www.npmjs.com/package/body-parser

// Advanced Parsers
const xmlparser = require('express-xml-bodyparser');									// https://www.npmjs.com/package/express-xml-bodyparser
const multer = require('multer');																			// https://www.npmjs.com/package/multer

// HTTPs
const https = require('https');																				// https://nodejs.org/api/https.html
const fs = require('fs');																							// https://nodejs.org/api/fs.html

// Other
// var HttpsProxyAgent = require('https-proxy-agent');	  						// https://www.npmjs.com/package/https-proxy-agent
// var queryString = require('query-string');													// https://www.npmjs.com/package/query-string
// var util = require('util');																				// https://nodejs.org/api/util.html


// *** PARSERS
exports.parseUrlEncoded = bodyParser.urlencoded({extended:false});		// URLEncoded
exports.parseJson = bodyParser.json();																// JSON
exports.parseRaw = bodyParser.raw();																	// BINARY
exports.parseText = bodyParser.text({type:'*/*'});										// TEXT
exports.parseXML = xmlparser({trim: false, explicitArray: false});		// XML
exports.parseFormWithAttachments = multer();													// Forms with attachments


// *** BUILD SERVER
exports.build = function() {
	var app = expressServer();
	app.set('view engine', 'ejs');
	app.use(expressServer.static(__dirname + '/../public'));
	
	// Create HTTP
	var port = process.env.PORT || 5000;
	var https_port = process.env.HTTPS_PORT || parseInt(port) + 1;
	http.createServer(app).listen(port);
	console.log("The server is running in port " + port);
	
	// Create HTTPS (Not needed in Heroku, but needed in LocalHost
	try {
			// Heroku
			var options = {
					key: fs.readFileSync('key.pem'),
					cert: fs.readFileSync('key-cert.pem')
			};
			https.createServer(options, app).listen(https_port);
			console.log("Heroku Server listening for HTTPS connections on port ", https_port);
	} catch (e) {
		// localhost
		var options = {
				pfx: fs.readFileSync('./Burp_Certificate.pfx'),
				passphrase: 'sfdc1234'
		};
		
		// Reads configuration from .env, if file does not exist then ignore
		try {
			 // env(__dirname + '/env', {verbose: true, overwrite: true, raise: false, logger: console});
			 env(__dirname + '/env');
		} catch (e) {}
	
		https.createServer(options, app).listen(https_port);
		console.log("Localhost Server listening for HTTPS connections on port ", https_port);
	}	
	return app;
}





/*
 
    

// *** INITIALIZE EXERCISES ***
	var ex104 = require('./lib/EX10_4');
	var testEmail = require('./lib/TestEmail');
	var ex111 = require('./lib/EX11_1');
	var sfdc = require('./lib/Salesforce');
	
// *** ENDPOINTS ***
    app.get('/', function(reqHTTP, resHTTP) {
    	resHTTP.send("<h1>Please specify full URL.</H1>" + new Date());
    });
    
    // Email tester    
    app.get('/testEmail', parseUrlEncoded, function(reqHTTP, resHTTP) {
		testEmail.showForm(reqHTTP, resHTTP);
    });
    app.post('/testEmail', parseFormWithAttachments.single('theFile'), function(reqHTTP, resHTTP) {
		testEmail.processForm(reqHTTP, resHTTP);
    });
    
    // Email handler    
    app.get('/emailHandler', parseUrlEncoded, function(reqHTTP, resHTTP) {
		ex104.showForm(reqHTTP, resHTTP, sfdc);
    });
    app.post('/emailHandler', parseFormWithAttachments.single('resume'), function(reqHTTP, resHTTP) {
		ex104.processForm(reqHTTP, resHTTP);
    });
    
    
    // Outbound message
    /*
	app.post('/obm', parseXML, function(reqHTTP, resHTTP, next) {
		// I could process the /obm with this parser which automatically converts the XML to JSON
		// but the original exercise stores the receiving XML data, so I am going to use a different 
		// parser where I have to manually convert the XML to JSON, but allows me to keep a copy of
		// the original data. 
	});
	* /
	app.post('/obm', parseText, function(reqHTTP, resHTTP) {
		ex111.processWS(reqHTTP, resHTTP, sfdc);
	});
                                  
    */					
