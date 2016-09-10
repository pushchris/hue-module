var hue = require('./lib/hue');

hue.discover(function (error, host) {
    if (error) {
        console.error(error);
        return;
    }

    console.log("Discovered HUE at %s", host);

    // Need to register for key first (not currently supported)
    hue.load({
        "host"  : host,
        "key"   : "APPLICATION_KEY"
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
});
