"use strict";

// *** LIBRARIES ***
const url = require('url');
const https = require('https');                           					// https://nodejs.org/api/https.html
const queryString = require('query-string');              					// https://www.npmjs.com/package/query-string
const printLongLines = require("./PrintLongLines");


// *** MODULE ***
// Calls a REST Apex webservice in a Force.com sites
exports.callPublicApex = function(reqHTTP, resHTTP, inputData, callback) {
	var jsonData = "";
	inputData = JSON.stringify(inputData);

	var endpoint = process.env.APEX_SITE_IMPORT_OBM;

	var options = url.parse(endpoint);
	options.method = 'POST';
	options.headers = {
		"Content-Length": inputData.length,
		"Content-Type": 'application/json'
	};
	// useProxy(options);
	

	var reqWS = https.request(options, function(resWS) {
		resWS.setEncoding('utf8');
		resWS.on('data', function(chunk) {
			jsonData += chunk;
		});
		resWS.on('end', function() {
			var output = JSON.parse(jsonData);
			output.statusCode = resWS.statusCode;
			callback(output);
		})
	});
	
	reqWS.on('error', function(e) {
		console.log('problem with request: ', e);
	});
	
	if (options.method == "POST") {
		reqWS.write(inputData);
	}
	
	reqWS.end();
}

function useProxy(options) {
	var HttpsProxyAgent = require('https-proxy-agent');
	options.agent = new HttpsProxyAgent('http://127.0.0.1:8080');
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}