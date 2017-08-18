"use strict";

// *** LIBRARIES ***
const xml2js = require('xml2js');																		// https://www.npmjs.com/package/xml2js
const printLongLines = require("./PrintLongLines");

exports.processWS = function(reqHTTP, resHTTP, sfdc) {
	var jsonData = reqHTTP.body;
	var obmData = processOBM(sfdc, jsonData['soapenv:envelope']['soapenv:body'].notifications);
	printLongLines("OBM Data: ", obmData);
	
	
	
	
	
	resHTTP.status(200).send(returnOBM(true));
	
	/*
	try {
		var compositeDML = sfdc.compositeInitialize({
			host: obmData.host,
			sid: obmData.sessionId,
			callback: function(output) {
				printLongLines("Ouput: ", output);
				resHTTP.status(200).send(returnOBM(true));
			}
		});
		sfdc.compositeAddDML(compositeDML, {
			operation: "IN", 
			sObject: "Outbound_Message__c",
			data: {
				JSON__c: JSON.stringify(jsonData),
				Message_XML__c: xmlData
			}
		});
		for (var index = 0, len = obmData.records.length; index < len; ++index) {
			var record = obmData.records[index];
			sfdc.compositeAddDML(compositeDML, {
				operation: "UP",
				sObject: "Candidate__c",
				id: record.id,
				data: {
					Background_Check_Status__c: "Pending - Sent"
				}
			});
		}
		sfdc.compositeExecute(compositeDML);
	} catch (ex) {
	resHTTP.status(200).send(returnOBM(false));
	}
	*/
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

function processOBM(sfdc, jsonData) {		
	var sObjects;
	var obmData = {};
	// obmData.host = sfdc.getHost(jsonData.enterpriseurl);
	for (var fieldName in jsonData) {
		if (fieldName == "$") continue;
		if (fieldName == "notification") continue;
		if (jsonData.hasOwnProperty(fieldName)) {
			obmData[fieldName] = jsonData[fieldName];
		}
	}	
	obmData.records = [];
	
	// If single element, convert to array.
	if (Array.isArray(jsonData.notification)) {
		sObjects = jsonData.notification;
	} else {
		sObjects = [];
		sObjects.push(jsonData.notification);
	}
	
	// Process Records
	for (var index = 0, len = sObjects.length; index < len; ++index) {
		var sObject = sObjects[index].sobject;
		var record = {};
		for (var fieldName in sObject){
			if (fieldName == "$") continue;
			if (sObject.hasOwnProperty(fieldName)) {
				var shortName = fieldName.replace("sf:","");
				record[shortName] = sObject[fieldName];
			}
		}
		obmData.records.push(record);
	}
	return obmData;			
}
