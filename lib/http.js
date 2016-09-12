var http = require('follow-redirects').http,
    util = require("util");

module.exports = {
    httpPost  : doPost,
    httpPut   : doPut,
    httpGet   : doGet,
    jsonGet   : doJsonGet
};

function doGet(host, port, path, callback) {
    return _doRequest(
    {
        "host": host,
        "port": port,
        "path": path
    }, callback);
}

function doJsonGet(host, port, path, callback) {
    return _doJsonRequest(
    {
        "host": host,
        "port": port,
        "path": path
    }, callback);
}

function doPost(host, port, path, values, callback) {
    return _doJsonRequest(
    {
        "host"  : host,
        "port"  : port,
        "path"  : path,
        "method": "POST",
        "values": values
    }, callback);
}

function doPut(host, port, path, values, callback) {
    return _doJsonRequest(
    {
        "host"  : host,
        "port"  : port,
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

    for (var i in parameters.values) {
        if ((parameters.values).hasOwnProperty(i)) {
            if (i == 'name' || i == 'id') {
                delete parameters.values[i];
            }
        }
    }

    if (parameters.host)
        options.host = parameters.host;
    else
        throw new Error("A host name must be provided in the parameters");

    options.method = parameters.method || "GET";

    if (parameters.path)
        options.path = parameters.path;

    if (parameters.values)
        options.body = JSON.stringify(parameters.values);

    options.headers = {
        accept: '*/*'
    };
    options.maxRedirects = 3;

    if (parameters.port)
      options.port = parameters.port;

    return options;
}

function _doRequest(parameters, callback) {
    if (!callback) callback = function() {};

    parameters = _buildOptions(parameters);
    var content = '';
    var request = http.request(parameters, function(response) {
        response.setEncoding('utf8');
        response.on("data", function(chunk) {
            content += chunk;
        });
        response.on('end', function() {
            callback(null, _parseJsonResult(content));
        });
    });

    request.on('error', function(e) {
        callback(e, null);
    });

    if (parameters.method == "POST" || parameters.method == "PUT")
        request.write(parameters.body);

    request.end();
}

function _parseJsonResult(result) {
    return JSON.parse(result.toString());
}
