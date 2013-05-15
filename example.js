var hue = require('./lib/hue');

hue.discover(function (error, host) {
  if (error) {
    console.error(error);
    return;
  }

  console.log("Discovered HUE at %s", host);
  hue.load(host, "APPLICATION_KEY"); // need to register this first (not currently supported)

  hue.lights(function(lights){
      for(i in lights)
          if(lights.hasOwnProperty(i))
              hue.change(lights[i].set({"on": true, "rgb":[Math.random() * 256 >>> 0, Math.random() * 256 >>> 0, Math.random() * 256 >>> 0]}));
  });
});
