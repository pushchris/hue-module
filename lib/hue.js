var crypto = require('crypto'),
	util = require('util'),
	path = require('./paths'),
	http = require('./http'),
	light = require('./light'),
	group = require('./group'),
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

exports.groups = function(callback) {
	if(!callback) callback = function() {};	
	
	function buildResults(result) {
		
        var groups = [],
            id;
        for(id in result)
            if(result.hasOwnProperty(id))
	            groups.push(group.create().set({ "id": id, "name": result[id].name }));
        return groups;
    }
    function process(err, result) {
	    callback(buildResults(result));
    }
    var host = this.host,
    	key = this.key;
    	
	if(authenticated)
		http.jsonGet(host, path.groups(key), process);
	else {
		connect(host, key, function(){
			http.jsonGet(host, path.groups(key), process);
		});	
	}	
}

exports.group = function(id, callback) {
	if(!callback) callback = function() {};
		
	function process(err, result) {
		console.log(result);
		callback(group.create().set(result.action).set({ "name": result.name, "id": id }));
	}
	var host = this.host,
    	key = this.key;
	
	if(authenticated)
		http.jsonGet(host, path.groups(key, id), process);
	else {
		connect(host, key, function(){
			http.jsonGet(host, path.groups(key, id), process);
		});	
	}
}

exports.createGroup = function(name, lights, callback) {
	if(!callback) callback = function() {};
	
	var host = this.host,
    	key = this.key,
    	values = {
            "name"  : name,
            "lights": _intArrayToStringArray(lights)
        };

    if(authenticated)
		http.httpPost(host, path.groups(key, null), values);
	else {
		connect(host, key, function(){
			http.httpPost(host, path.groups(key, null), values);
		});	
	}
}
exports.change = function(object){
	var host = this.host,
    	key = this.key,
    	location;
    
    if(object.type == 'group'){
    	console.log("group");
    	location = path.groupState(key, object.id)
    }else
    	location = path.lightState(key, object.id)
    	
	if(authenticated)
		http.httpPut(host, location, object);
	else {
		connect(host, key, function(){
			http.httpPut(host, location, object);
		});
	}	
}


function connect(host, key, callback) {
	if(!callback) callback = function() {};
    http.jsonGet(host, path.api(key), function(err, result) {
		if(err)
			throw new Error('There is no Hue Station at the given address.');
		authenticated = true;
		callback(result);
	});
}

function _intArrayToStringArray(array){
	retArr = [];
	for(entry in array)
		retArr.push(array[entry]+"");
	return retArr;
}