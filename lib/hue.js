var crypto = require('crypto'),
    util = require('util'),
    path = require('./paths'),
    http = require('./http'),
    light = require('./light'),
    group = require('./group'),
    exports = module.exports = {};

var authenticated = false;

exports.discover = function(timeout, callback) {
    if (typeof(callback) == "undefined") {
        callback = timeout;
        timeout = 5000;
    }

    var os = require('os');
    var dgram = require("dgram");

    /* get a list of our local IPv4 addresses */

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var dev in interfaces) {
        for (var i = 0; i < interfaces[dev].length; i++) {
            if (interfaces[dev][i].family != 'IPv4') continue;
            if (interfaces[dev][i].internal) continue;
            addresses.push(interfaces[dev][i].address);
        }
    }

    /* this code adapted from https://github.com/Burgestrand/ruhue/blob/master/lib/ruhue.rb#L23 */

    var socket = dgram.createSocket("udp4");
    socket.bind(function() {
        socket.setBroadcast(true);
        socket.setMulticastTTL(128);
        addresses.forEach(function(address) {
            socket.addMembership("239.255.255.250", address);
        });

        var payload = new Buffer([
            "M-SEARCH * HTTP/1.1",
            "HOST: 239.255.255.250:1900",
            "MAN: ssdp:discover",
            "MX: 10",
            "ST: ssdp:all"
        ].join("\n"));

        socket.on("error", console.error);

        var timer = null;
        socket.on("message", function(msg, rinfo) {
            if (msg.toString('utf8').match(/IpBridge/)) { // check to see if it's a HUE responding
                socket.close();
                if (timer) clearTimeout(timer);

                callback(null, rinfo.address);
            }
        });

        socket.send(payload, 0, payload.length, 1900, "239.255.255.250", function() {
            timer = setTimeout(function () {
                socket.close();
                callback("Discovery timeout expired.");
            }, timeout);
        });
    });
}

exports.load = function(parameters, callback) {
    if (!callback) callback = function() {};

    if (!parameters || !parameters.host || !parameters.key)
        throw new Error('IP Address and application key are both required parameters.');

    this.host = parameters.host;
    this.port = parameters.port || 80;
    this.key = parameters.key; //crypto.createHash('md5').update(appName).digest("hex");

    authenticated = false;

    connect(host, key, function(err, result) {
        callback();
    });
}

exports.lights = function(callback) {

    if (!callback) callback = function() {};

    function buildResults(result) {
        var lights = [],
            id;

        for (id in result) {
            if (result.hasOwnProperty(id)) {
                lights.push(light.create().set({ "id": id, "name": result[id].name }));
            }
        }
        return lights;
    }

    function process(err, result) {
        callback(buildResults(result));
    }

    var host = this.host,
        key = this.key,
        port = this.port;

    if (authenticated) {

        http.jsonGet(host, port, path.lights(key), process);
    }
    else {
        connect(host, key, function() {
            http.jsonGet(host, port, path.lights(key), process);
        });
    }
}

exports.light = function(id, callback) {

    if (!callback) callback = function() {};

    function process(err, result) {
        callback(light.create().set(result.state).set({ "name": result.name, "id": id }));
    }
    var host = this.host,
        key = this.key,
        port = this.port;

    if (authenticated) {

        http.jsonGet(host, port, path.lights(key, id), process);
    }
    else {
        connect(host, key, function() {
            http.jsonGet(host, port, path.lights(key, id), process);
        });
    }
}

exports.groups = function(callback) {

    if (!callback) callback = function() {};

    function buildResults(result) {

        var groups = [],
            id;

        for (id in result) {
            if (result.hasOwnProperty(id)) {
                groups.push(group.create().set({ "id": id, "name": result[id].name }));
            }
        }
        return groups;
    }

    function process(err, result) {
        callback(buildResults(result));
    }

    var host = this.host,
        key = this.key,
        port = this.port;

    if (authenticated) {

        http.jsonGet(host, port, path.groups(key), process);
    }
    else {
        connect(host, key, function(){
            http.jsonGet(host, path.groups(key), process);
        });
    }
}

exports.group = function(id, callback) {

    if (!callback) callback = function() {};

    function process(err, result) {

        callback(group.create().set(result.action).set({ "name": result.name, "id": id }));
    }
    var host = this.host,
        key = this.key,
        port = this.port;

    if (authenticated) {

        http.jsonGet(host, path.groups(key, id), process);
    }
    else {
        connect(host, key, function(){
            http.jsonGet(host, path.groups(key, id), process);
        });
    }
}

exports.createGroup = function(name, lights, callback) {

    if (!callback) callback = function() {};

    var host = this.host,
        key = this.key,
        port = this.port,
        values = {
            "name"  : name,
            "lights": _intArrayToStringArray(lights)
        };

    if (authenticated) {
        http.httpPost(host, port, path.groups(key, null), values);
    }
    else {
        connect(host, key, function() {
            http.httpPost(host, path.groups(key, null), values);
        });
    }
}

exports.change = function(object){
    var host = this.host,
        key = this.key,
        port = this.port,
        location;

    if (object.type == 'group') {

        location = path.groupState(key, object.id)
    }
    else {
        location = path.lightState(key, object.id)
    }

    if (authenticated) {

        http.httpPut(host, location, object);
    }
    else {
        connect(host, key, function(){
            http.httpPut(host, location, object);
        });
    }
}

function connect(host, key, callback) {

    if (!callback) callback = function() {};
    http.jsonGet(host, path.api(key), function(err, result) {
        if (err)
            throw new Error('There is no Hue Station at the given address.');

        authenticated = true;
        callback(result);
    });
}

function _intArrayToStringArray(array){
    retArr = [];
    for (var entry in array)
        retArr.push(array[entry]+"");
    return retArr;
}
