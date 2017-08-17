"use strict";

var webServer = require('./lib/webServer');
var ws = webServer.build();

ws.get('/', function(req, res) {
	var params = {};
	params.dttm = new Date();
	res.render('helloWorld', params);
});

ws.post('/', webServer.parseUrlEncoded, function(req, res) {
	var params = {};
	params.fname = req.body.fname;
	params.sfdcStart = req.body.sfdcStart;
	res.render('helloWorld', params);
});
