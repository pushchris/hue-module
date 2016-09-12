var color = require('./colors'),
    utilities = require('./utilities');

var Group = function () {
    this.type = "group";
};

module.exports.create = function () {
    return new Group();
};

Group.prototype.set = function(value) {
    if (value.rgb !== null) {

        utilities.combine(this, { "xy": color.rgbToCIE1931(value.rgb[0], value.rgb[1], value.rgb[2]) });
        delete value.rgb;
    }

    utilities.combine(this, value);

    return this;
};
