"use strict";

const webServer = require('./lib/WebServer');
const ws = webServer.build();

const handleOBM = require('./lib/HandleOBM');
const sfdc = require('./lib/Salesforce');

ws.get('/', function(reqHTTP, resHTTP) {
	console.log('Verbose: ' + process.env.VERBOSE);
	if (process.env.VERBOSE) {
		console.log("GET request on root... ignored");
	}
	resHTTP.send('This application handles Outbound Messages sent via a POST request, and therefore does not support GET requests. ' + new Date());
	resHTTP.end();
});

ws.post('/obm', webServer.parseXML, function(reqHTTP, resHTTP, next) {
	if (process.env.VERBOSE) {
		console.log("POST request on /obm... processing");
		console.log("Body: ");
		console.log(reqHTTP.body);
	}
	handleOBM.processWS(reqHTTP, resHTTP, sfdc);
});
