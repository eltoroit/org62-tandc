"use strict";

// *** LIBRARIES ***
const url = require('url');
const https = require('https');                           					// https://nodejs.org/api/https.html
const queryString = require('query-string');              					// https://www.npmjs.com/package/query-string
const printLongLines = require("./PrintLongLines");


// *** MODULE ***
// Calls a REST Apex webservice in a Force.com sites
exports.callPublicApex = function(reqHTTP, resHTTP, inputData, callback) {
	var response = { V1: {}, V2: {} }
	if (process.env.LOG_MAX) {
		printLongLines("Salesforce.callPublicApex:ENTRY", {});
	}

	var strBase64 = Buffer.from(inputData.content).toString('base64');
	if (process.env.LOG_MAX) {
		printLongLines("Data to sent to Destination Org (T&C Org) [STR->BASE64]: ", strBase64);
	}
	
	// Version 1.0
	var endpointV1 = process.env.APEX_SITE_IMPORT_OBM1;
	if (endpointV1) {
		response.V1 = {skipped: false, done: false};
		makeCall(
			endpointV1,
			JSON.stringify({'validator': inputData.validator,'content': strBase64}),
			function(output) {
				if (process.env.LOG_INFO) {
					printLongLines('Apex finished in Org (V1): ', output);
				}
				response.V1.done = true;
				response.V1.output = output;
				response.V1.valid = output.response.success;
				callback(response);
			}
		);	
	} else {
		response.V1.skipped = true;
	}
	
	// Version 2.0
	var endpointV2 = process.env.APEX_SITE_IMPORT_OBM2;
	if (endpointV2) {
		response.V2 = {skipped: false, done: false};
		makeCall(
			endpointV2,
			JSON.stringify({'validator': inputData.validator,'BASE64': strBase64}),
			function(output) {
				if (process.env.LOG_INFO) {
					printLongLines('Apex finished in Org (V2): ', output);
				}
				response.V2.done = true;
				response.V2.output = output;
				response.V2.valid = output.response.success;
				callback(response);
			}
		);	
	} else {
		response.V2.skipped = true;
	}

	if (response.V1.skipped && response.V2.skipped) {
		throw new Error('Nothing was configured to be processed.');
	}
}

function makeCall(endpoint, postData, callback) {
	if (process.env.LOG_INFO) {
		printLongLines("Endpoint for Org: ", endpoint);
	}
	if (process.env.LOG_MAX) {
		printLongLines("Data to send to Destination Org (T&C Org) [STR->BASE64->JSON]: ", postData);
	}
	
	var outputData = "";
	var options = url.parse(endpoint);
	options.method = 'POST';
	options.headers = {
		"Content-Length": Buffer.byteLength(postData),
		"Content-Type": 'application/json'
	};
	if (process.env.LOG_MAX) {
		printLongLines('Server request to Destination Org (T&C Org): ', options);
	}
	// useProxy(options);
	
	var reqWS = https.request(options, function(resWS) {
		resWS.setEncoding('utf8');
		resWS.on('data', function(chunk) {
			outputData += chunk;
		});
		resWS.on('end', function() {
			var output = {};
			output.response = JSON.parse(outputData);
			output.endpoint = endpoint;
			output.statusCode = resWS.statusCode;
			if (process.env.LOG_MAX) {
				printLongLines('Output from Destination Org (T&C Org): ', output);
			}
			if (process.env.LOG_MAX) {
				printLongLines("Salesforce.callPublicApex:EXIT", {});
			}
			try {
				callback(output);
			} catch (ex) {
				console.error(ex);
			}
		})
	});
	
	reqWS.on('error', function(e) {
		printLongLines('Problem with request to Destination Org (T&C Org): ', e);
	});
	
	if (options.method == "POST") {
		reqWS.write(postData);
	}
	
	reqWS.end();
}

function useProxy(options) {
	var HttpsProxyAgent = require('https-proxy-agent');
	options.agent = new HttpsProxyAgent('http://127.0.0.1:8080');
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}