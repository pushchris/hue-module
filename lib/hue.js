var crypto = require('crypto'),
	events = require('events'),
	request = require('request'),
	util = require('util'),
	path = require('./paths'),
	http = require('./http');

/* Hue
 *
 * Constructor for the Hue class.  Assigns the IP address and app name
 * from the supplied parameters and generates the application key by
 * md5ing the app name.  Hue is an event emitter.
 *
 * @param   ipAddress    The ip address of the hue base station.
 * @param   appName      The name of the application you want to authenticate.
 */
function Hue(ipAddress, appName) {
	if(!ipAddress || !appName) 
		throw new Error('IP Address and application name are both required parameters.');
	events.EventEmitter.call(this);

	this.ipAddress = ipAddress;
	this.appName = appName;
	this.key = crypto.createHash('md5').update(appName).digest("hex");
	this.authenticated = false;
}

util.inherits(Hue, events.EventEmitter);

Hue.prototype.authenticate = function(callback) {
	if(!callback) callback = function() { };
	
	this.emit('ready');

	this.authenticated = true;
	callback();
};

Hue.prototype.lights = function(callback) {
	if(!callback) callback = function() { };	
	
	function buildResults(result) {
        var lights = [],
            id;

        for (id in result) {
            if (result.hasOwnProperty(id)) {
                lights.push(
                    {
                        "id"  : id,
                        "name": result[id].name
                    }
                );
            }
        }
        return {"lights": lights};
    }
	
	var result = http.jsonGet(this.ipAddress, path.lights(this.key));
	
	callback(buildResults(result));	
}

module.exports = Hue;
