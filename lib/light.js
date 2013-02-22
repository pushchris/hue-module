var Light = function () {

};


module.exports.create = function () {
    return new Light();
};

Light.prototype.set = function(value){
	if(value.rgb != null){
		combine(this, rgb2xyz(value.rgb[0], value.rgb[1], value.rgb[2]));
		//combine(this, rgbToHsl(value.rgb[0], value.rgb[1], value.rgb[2]));
		delete value.rgb;
		
	}
	
	combine(this, value);
    
	return this; 
}

function rgb2xyz(red, green, blue) {
	var xyz,
		rgb = [ red / 255, green / 255, blue / 255 ];


	xyz = [
		(.3739 * rgb[0]) + (.2386 * rgb[1]) + (-.0906 * rgb[2]),
		(.1303 * rgb[0]) + (.4939 * rgb[1]) + (-.0989 * rgb[2]),
		(.0366 * rgb[0]) + (-.0635 * rgb[1]) + (.5085 * rgb[2])
		];
	return { "xy": [
					xyz[0],
					xyz[1]
					]};
}

function rgb2hsl(red, green, blue){

	var h = 0,
		s = 0,
		l = 0,
		r = parseFloat(red) / 255,
		g = parseFloat(green) / 255,
		b = parseFloat(blue) / 255;

	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var add = min + max;
	
	if (min === max)
		h = 0;
    else if (r === max)
    	h = ((60 * (g - b) / delta) + 360) % 360;
    else if (g === max)
    	h = (60 * (b - r) / delta) + 120;
    else
    	h = (60 * (r - g) / delta) + 240;

    var l = 0.5 * add;
    if (l === 0)
    	s = 0;
    else if (l === 1)
    	s = 1;
    else if (l <= 0.5)
    	s = delta / add;
    else
    	s = delta / (2 - add);
    
    h = getBounded(Math.floor(getBounded(Math.round(h), 0, 359) * 182.5487), 0, 65535);
    s = getBounded(Math.floor(getBounded(Math.round(s * 100), 0, 100) * (255 / 100)), 0, 254);
    l = brightnessToHue(Math.round(l * 100));

    return {
            "hue": h,
            "sat": s,
            "bri": l
        }
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
