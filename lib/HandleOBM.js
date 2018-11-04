"use strict";

// *** LIBRARIES ***
const xml2js = require('xml2js');																		// https://www.npmjs.com/package/xml2js
const printLongLines = require("./PrintLongLines");

exports.processWS = function(reqHTTP, resHTTP, sfdc) {
	if (process.env.LOG_MAX) {
		printLongLines('Body from Source Org (ORG62): ', reqHTTP.body);
	}

	var validator;
	validator = process.env.VALIDATOR;
	validator = validator + "|" + JSON.stringify(new Date());
	validator = new Buffer(validator).toString('base64');
	if (process.env.LOG_MAX) {
		printLongLines('Heroku Validator: ', validator);
	}
	
	var data = {
		validator: validator,
		content: JSON.stringify(reqHTTP.body)
	}
	sfdc.callPublicApex(reqHTTP, resHTTP, data, function(response) {
		if (process.env.LOG_INFO) {
			console.log(response);
		}
		
		if ((response.V1.skipped || response.V1.done) && (response.V2.skipped || response.V2.done)) {
			var isValid = true;
			isValid = isValid && (response.V1.skipped || response.V1.valid);
			isValid = isValid && (response.V2.skipped || response.V2.valid);
			resHTTP.status(200).send(returnOBM(isValid));
		}
	});
}

function returnOBM(isSuccess) {
	var msg = '';
	msg += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound">';
	msg += '<soapenv:Header/>';
	msg += '<soapenv:Body>';
	msg += '<out:notificationsResponse>';
	msg += '<out:Ack>' + isSuccess + '</out:Ack>';
	msg += '</out:notificationsResponse>';
	msg += '</soapenv:Body>';
	msg += '</soapenv:Envelope>';
	return msg;
}