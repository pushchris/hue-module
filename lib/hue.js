var crypto = require('crypto'),
	util = require('util'),
	path = require('./paths'),
	http = require('./http'),
	light = require('./light'),
	exports = module.exports = {};

var authenticated = false;	

exports.load = function(host, key, callback) {
	if(!callback) callback = function() {};

	if(!host || !key) 
		throw new Error('IP Address and application name are both required parameters.');

	this.host = host;
	this.key = key; //crypto.createHash('md5').update(appName).digest("hex");
	
	authenticated = false;
	
	connect(host, key, function(err, result){
		callback();
	});
}

exports.lights = function(callback) {
	if(!callback) callback = function() {};	
	
	function buildResults(result) {
        var lights = [],
            id;
        for(id in result)
            if(result.hasOwnProperty(id))
	            lights.push(light.create().set({ "id": id, "name": result[id].name }));
        return lights;
    }
    function process(err, result){
	    callback(buildResults(result));
    }
    var host = this.host,
    	key = this.key;
    	
	if(authenticated)
		http.jsonGet(host, path.lights(key), process);
	else {
		connect(host, key, function(){
			http.jsonGet(host, path.lights(key), process);
		});	
	}	
}

exports.light = function(id, callback) {
	if(!callback) callback = function() {};
		
	function process(err, result){
		callback(light.create().set(result.state).set({ "name": result.name, "id": id }));
	}
	var host = this.host,
    	key = this.key;
	
	if(authenticated)
		http.jsonGet(host, path.lights(key, id), process);
	else {
		connect(host, key, function(){
			http.jsonGet(host, path.lights(key, id), process);
		});	
	}	
}

exports.change = function(bulb){
	var host = this.host,
    	key = this.key;
    	
	if(authenticated)
		http.httpPut(host, path.lightState(key, bulb.id), bulb);
	else {
		connect(host, key, function(){
			http.httpPut(host, path.lightState(key, bulb.id), bulb);
		});
	}	
}


function connect(host, key, callback){
	if(!callback) callback = function() {};
    http.jsonGet(host, path.api(key), function(err, result){
		if(err)
			throw new Error('There is no Hue Station at the given address.');
		authenticated = true;
		callback(result);
	});
}