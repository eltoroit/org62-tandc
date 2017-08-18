"use strict";

var webServer = require('./lib/webServer');
var ws = webServer.build();

ws.get('/', function(req, res) {
	res.send('Application being built. Please wait...');
});