"use strict";
 
function printLongLines(title, jsonData, cols) {
    // Remove breaks: http://www.textfixer.com/tools/remove-line-breaks.php
    // JSON Viewer: http://jsonviewer.stack.hu/
    // URL Decoder/Encoder: http://meyerweb.com/eric/tools/dencoder/

	if (!jsonData) {
		throw Error("ERROR ON PRINTING LONG LINES. Missing jsonData to display");
	}

    var str = "";
    console.log("===" + title + "===");
    // str += title + ": ";
    str += JSON.stringify(jsonData);
    if (!cols) cols = 100;
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