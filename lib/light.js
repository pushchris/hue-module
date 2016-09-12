var color = require('./colors'),
    utilities = require('./utilities');

var Light = function () {

    this.type = "light";
};

module.exports.create = function () {

    return new Light();
};

Light.prototype.set = function(value) {

    if (value.rgb !== null) {
        utilities.combine(this, { "xy": color.rgbToCIE1931(value.rgb[0], value.rgb[1], value.rgb[2]) });
        delete value.rgb;
    }

    utilities.combine(this, value);

    return this;
};
