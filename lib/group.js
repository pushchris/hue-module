var color = require('./colors');

var Group = function () {
	this.type = "group";
};

module.exports.create = function () {
    return new Group();
};

Group.prototype.set = function(value){
	if(value.rgb != null){
		combine(this, { "xy": color.rgbToCIE1931(value.rgb[0], value.rgb[1], value.rgb[2]) });
		delete value.rgb;
		
	}
	
	combine(this, value);
    
	return this; 
}

function brightnessToHue(value){
	return Math.floor(getBounded(value, 0, 100) * (255 / 100));
}

function combine(obj, values){
	var argIdx = 1,
        state,
        property;

    while (argIdx < arguments.length) {
        state = arguments[argIdx];
        for (property in state) {
            obj[property] = state[property];
        }
        argIdx++;
    }
    return obj;
}


function getBounded(value, min, max) {
	if (isNaN(value))
		value = min;
	if (value < min)
		return min;
	else if (value > max)
		return max;
	else
		return value;
}
