var hue = require('./lib/hue');

var loadBridge = function(host) {
    hue.load({
        "host"  : host
    });

    hue.getUsername(function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        turnOnLights(host, result.username);
    });
};

var turnOnLights = function(host, username) {
    hue.load({
        "host"  : host,
        "key"   : username
    });

    hue.lights(function(lights) {
        for (var i in lights) {
            if (lights.hasOwnProperty(i)) {
                hue.change(lights[i].set({
                    "on"    : true,
                    "rgb"   : [
                        Math.random() * 256 >>> 0,
                        Math.random() * 256 >>> 0,
                        Math.random() * 256 >>> 0
                    ]
                }));
            }
        }
    });
};

hue.nupnpDiscover(function(error, hosts) {

    if (error) {
        console.error(error);
        return;
    }

    for (var i in hosts) {
        if (hosts.hasOwnProperty(i)) {
            loadBridge(hosts[i].internalipaddress);
        }
    }
});
