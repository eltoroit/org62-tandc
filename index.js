"use strict";

const webServer = require('./lib/WebServer');
const ws = webServer.build();

const handleOBM = require('./lib/HandleOBM');
const sfdc = require('./lib/Salesforce');

ws.get('/', function(reqHTTP, resHTTP) {
	resHTTP.send('This application handles Outbound Messages sent via a POST request, and therefore does not support GET requests. ' + new Date());
	resHTTP.end();
});

ws.post('/', webServer.parseXML, function(reqHTTP, resHTTP, next) {
	handleOBM.processWS(reqHTTP, resHTTP, sfdc);
});
