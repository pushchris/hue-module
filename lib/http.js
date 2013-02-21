var http = require("q-io/http"),
    BufferStream = require("q-io/buffer-stream"),
    util = require("util");

module.exports = {
    httpPost  : doPost,
    httpPut   : doPut,
    httpGet   : doGet,
    jsonGet   : doJsonGet,
    httpDelete: doDelete
};



function doGet(host, path) {
    return _doRequest(
        {
            "host": host,
            "path": path
        }
    );
}

function doJsonGet(host, path) {
    return _doJsonRequest(
        {
            "host": host,
            "path": path
        }
    );
}

function doPost(ipAddress, path, values) {
    return _doJsonRequest(
        {
            "host"  : ipAddress,
            "path"  : path,
            "method": "POST",
            "values": values
        });
}

function doPut(ipAddress, path, values) {
    return _doJsonRequest(
        {
            "host"  : ipAddress,
            "path"  : path,
            "method": "PUT",
            "values": values
        });
}

function _doJsonRequest(parameters) {

    function processResponse(response) {
        return _parseJsonResult(response);
    }

    return processResponse(_doRequest(parameters));
}

function _buildOptions(parameters) {
	var options = {};
	
	if (parameters.host)
		options.host = parameters.host;
	else
		throw new Error("A host name must be provided in the parameters");
		
	options.method = parameters.method || "GET";

    if (parameters.path)
        options.path = parameters.path;

    if (parameters.values)
        options.body = new BufferStream(JSON.stringify(parameters.values), "utf-8");

    return options;
}

function _doRequest(parameters) {
    var options = _buildOptions(parameters);
    return http.request(options);
}

function _parseJsonResult(result) {
    var str,
        jsonResult,
        jsonError;

    str = result.toString();

    jsonResult = JSON.parse(str);

    return {
        result: jsonError ? null : jsonResult
    };
}