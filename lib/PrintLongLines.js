"use strict";
 
function printLongLines(title, jsonData, cols) {
    // Remove breaks: http://www.textfixer.com/tools/remove-line-breaks.php
    // JSON Viewer: http://jsonviewer.stack.hu/
    // URL Decoder/Encoder: http://meyerweb.com/eric/tools/dencoder/

	if (!jsonData) {
		throw Error("ERROR ON PRINTING LONG LINES");
	}
    if (!cols) cols = 100;
    var str = title + ": " + JSON.stringify(jsonData);
    while (str.length > 0) {
        var line = str.substr(0, cols);
        if (str.length > cols) {
            str = str.substr(cols, str.length);
        } else {
            str = "";
        }
        console.log(line);
    }

//    console.log("LONG TEST: ", jsonData);
}
 
module.exports = printLongLines;