# Node Hue Module

This is a node.js client library for the [Philips Hue](http://www.meethue.com).


## Installation

	npm install hue-module

## Usage

In order to use the hue.js library, you will need to know the IP address of the
hue base station.  You can find this through the
[meethue dashboard](http://www.meethue.com/) or using arp.  To use arp, note the
MAC address of the device (written on the bottom of the base station) and then
issue the `arp -a` command from your terminal.

    var hue = require('hue-module');
    
    hue.load({
        "host"  : "IP Address", 
        "key"   : "Username/Key",
        "port"  : 80
    });

    hue.lights(function(lights) {
		for (i in lights) {
			if (lights.hasOwnProperty(i)) {
				hue.change(lights[i].set({"on": true, "rgb":[0,255,255]}));
            }
        }
	});

At the moment there is no way to discover a base station or register with it. This is coming soon.

## API

Below you will find an outline of the available methods, their purpose, and the
corresponding usage example.

### Find your basestation

If you do not already know the IP address of the base station you can search for it.

    hue.nupnpDiscover(callback)
    
### Register a username

To be able to send requests you need to register for a username. Do so by calling the following command after loading.

    hue.getUsername(callback)
    
An IP address is returned in the callback that can then be used to load the module.

### Get a list of lights

    hue.lights(callback)
    
In the callback a list of lights are returned. Each light can be set however one chooses.
  
### Get a particular light

	hue.light(lightID, callback)
	
### Set settings of a particular light

	light.set(attributes)
	
Usage example:

	hue.light(1, function(light) {
		light.set({ "on": false });
	});

### Render changes to bulb

	hue.change(light)
	
Usage example:

	hue.light(1, function(light) {
		hue.change(light.set({ "on": false }));
	});
### Get a list of light groups

	hue.groups(callback)

An array of groups is returned in the callback.

### Get a particular group

	hue.group(groupID, callback)
