var crypto = require('crypto'),
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
	
	connect(host, key);
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
    var host = this.host,
    	key = this.key;
    	
	if(this.authenticated)
		http.jsonGet(host, path.lights(key), process);
	else{
		connect(host, key, function(){
			http.jsonGet(host, path.lights(key), process);
		});	
	}	
}

exports.light = function(id, callback) {
	if(!callback) callback = function() { };
		
	function process(result){
		callback(light.create().set(result.state).set({ "name": result.name, "id": id }));
	}
	var host = this.host,
    	key = this.key;
	
	if(this.authenticated)
		http.jsonGet(host, path.lights(key, id), process);
	else{
		connect(host, key, function(){
			http.jsonGet(host, path.lights(key, id), process);
		});	
	}	
}

exports.change = function(bulb){
	var host = this.host,
    	key = this.key;
    	
	if(this.authenticated)
		http.httpPut(host, path.lightState(key, bulb.id), bulb, function(){});
	else{
		connect(host, key, function(){
			http.httpPut(host, path.lightState(key, bulb.id), bulb, function(){});
		});
	}	
}


function connect(host, key, callback){
	if(!callback) callback = function() { };
	
	var result = function(result){
		this.authentication = true;
		callback();
	}
    http.jsonGet(host, path.api(key), result);
}