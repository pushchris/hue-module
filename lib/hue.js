var crypto = require('crypto'),
	events = require('events'),
	request = require('request'),
	util = require('util'),
	path = require('./paths'),
	http = require('./http'),
	light = require('./light'),
	exports = module.exports = {};


exports.load = function(host, key) {
	if(!host || !key) 
		throw new Error('IP Address and application name are both required parameters.');

	this.host = host;
	this.key = key; //crypto.createHash('md5').update(appName).digest("hex");
	this.authenticated = false;
}

exports.lights = function(callback) {
	if(!callback) callback = function() { };	
	
	function buildResults(result) {
        var lights = [],
            id;
        for(id in result) {
            if(result.hasOwnProperty(id))
	            lights.push(light.create().set({ "id": id, "name": result[id].name }));
        }
        return lights;
    }
    function process(result){
	    callback(buildResults(result));
    }
	http.jsonGet(this.host, path.lights(this.key), process);		
}

exports.light = function(id, callback) {
	if(!callback) callback = function() { };
		
	function process(result){
		callback(light.create().set(result.state).set({ "name": result.name, "id": id }));
	}

	http.jsonGet(this.host, path.lights(this.key, id), process);
}

exports.change = function(bulb){
	http.httpPut(this.host, path.lightState(this.key, bulb.id), bulb, function(){});
}