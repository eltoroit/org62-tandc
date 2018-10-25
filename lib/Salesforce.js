"use strict";

// *** LIBRARIES ***
const url = require('url');
const https = require('https');                           					// https://nodejs.org/api/https.html
const queryString = require('query-string');              					// https://www.npmjs.com/package/query-string
const printLongLines = require("./PrintLongLines");


// *** MODULE ***
// Calls a REST Apex webservice in a Force.com sites
exports.callPublicApex = function(reqHTTP, resHTTP, inputData, callback) {
	if (process.env.VERBOSE) {
		printLongLines("Salesforce.callPublicApex:ENTRY", {});
	}

	var outputData = "";

	inputData = JSON.stringify(inputData);
	if (process.env.VERBOSE) {
		printLongLines("Data to sent to Destination Org (T&C Org): ", inputData);
	}

	var endpoint = process.env.APEX_SITE_IMPORT_OBM;
	if (process.env.VERBOSE) {
		printLongLines("Endpoint for Destination Org (T&C Org): ", endpoint);
	}

	var options = url.parse(endpoint);
	options.method = 'POST';
	options.headers = {
		"Content-Length": inputData.length,
		"Content-Type": 'application/json'
	};
	if (process.env.VERBOSE) {
		printLongLines('Server Request (1) to Destination Org (T&C Org): ', options);
	}
	// useProxy(options);
	
	var reqWS = https.request(options, function(resWS) {
		resWS.setEncoding('utf8');
		resWS.on('data', function(chunk) {
			outputData += chunk;
		});
		resWS.on('end', function() {
			var output = JSON.parse(outputData);
			output.statusCode = resWS.statusCode;
			if (process.env.VERBOSE) {
				printLongLines('Output from Destination Org (T&C Org): ', output);
			}
			if (process.env.VERBOSE) {
				printLongLines("Salesforce.callPublicApex:EXIT", {});
			}
			callback(output);
		})
	});
	
	reqWS.on('error', function(e) {
		printLongLines('Problem with request to Destination Org (T&C Org): ', e);
	});
	
	if (options.method == "POST") {
		reqWS.write(inputData);
	}
	
	reqWS.end();
	if (process.env.VERBOSE) {
		printLongLines('Server Request (2) to Destination Org (T&C Org): ', reqWS);
	}
}

function useProxy(options) {
	var HttpsProxyAgent = require('https-proxy-agent');
	options.agent = new HttpsProxyAgent('http://127.0.0.1:8080');
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}