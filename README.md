# hue.js

This is a node.js client library for the [Philips Hue](http://www.meethue.com).

## Installation

    npm install hue

## Usage

In order to use the hue.js library, you will need to know the IP address of the
hue base station.  You can find this through the
[meethue dashboard](http://www.meethue.com/) or using arp.  To use arp, note the
MAC address of the device (written on the bottom of the base station) and then
issue the `arp -a` command from your terminal.

    var Hue = require('hue')
      , app = new Hue("192.168.1.x", "My First Hue Application");

    app.on('ready', function() {
      app.lights.on();
    });

## API

Below you will find an outline of the available methods, their purpose, and the
corresponding usage example.

### Get a list of lights (GET /api/myappkey/lights)

    app.lights(callback) // array of lights

