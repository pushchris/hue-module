var http = require("http"),
    util = require("util");

module.exports = {
    httpPost  : doPost,
    httpPut   : doPut,
    httpGet   : doGet,
    jsonGet   : doJsonGet
};



function doGet(host, path, callback) {
    return _doRequest(
        {
            "host": host,
            "path": path
        }, callback);
}

function doJsonGet(host, path, callback) {
    return _doJsonRequest(
        {
            "host": host,
            "path": path
        }, callback);
}

function doPost(ipAddress, path, values, callback) {
    return _doJsonRequest(
        {
            "host"  : ipAddress,
            "path"  : path,
            "method": "POST",
            "values": values
        }, callback);
}

function doPut(ipAddress, path, values, callback) {
    return _doJsonRequest(
        {
            "host"  : ipAddress,
            "path"  : path,
            "method": "PUT",
            "values": values
        }, callback);
}

function _doJsonRequest(parameters, callback) {
    return _doRequest(parameters, callback);
}

function _buildOptions(parameters) {
	var options = {};
	
	for(i in parameters.values)
		if((parameters.values).hasOwnProperty(i))
			if(i == 'name' || i == 'id')
				delete parameters.values[i];
	
	if (parameters.host)
		options.host = parameters.host;
	else
		throw new Error("A host name must be provided in the parameters");
		
	options.method = parameters.method || "GET";

    if (parameters.path)
        options.path = parameters.path;

    if (parameters.values)
        options.body = JSON.stringify(parameters.values);

    return options;
}

function _doRequest(parameters, callback) {
	parameters = _buildOptions(parameters);
    var request = http.request(parameters, function(response){
    	response.setEncoding('utf8');
    	response.on("data", function(chunk) {
	    	callback(_parseJsonResult(chunk));
	    });
    });
    if(parameters.method == "POST" || parameters.method == "PUT")
    	request.write(parameters.body);
    request.end();
}

function _parseJsonResult(result) {
    return JSON.parse(result.toString());
}