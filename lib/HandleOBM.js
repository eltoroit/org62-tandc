"use strict";

// *** LIBRARIES ***
const xml2js = require('xml2js');																		// https://www.npmjs.com/package/xml2js
const printLongLines = require("./PrintLongLines");

exports.processWS = function(reqHTTP, resHTTP, sfdc) {
	var data = {
		validator: "V",
		content: JSON.stringify(reqHTTP.body)
	}
	sfdc.callPublicApex(reqHTTP, resHTTP, data, function(output) {
		printLongLines('OUTPUT: ', output);
		resHTTP.status(200).send(returnOBM(output.success));
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