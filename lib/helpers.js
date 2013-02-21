/* rgb2xyz
 *
 * Converts RGB values into normalized [x, y] coordinates for the hue
 * to use.
 *
 * sources:
 *  - https://github.com/alistairg/IndigoHue
 *  - http://en.wikipedia.org/wiki/CIE_1931_color_space
 *
 * @param   red    integer
 * @param   green  integer
 * @param   blue   integer
 * @return  array  [x,y]
 */
function rgb2xyz(red, green, blue) {
	var xyz,
		rgb = [ red / 255, green / 255, blue / 255 ];

	for(var i = 0; i < 3; i++) {
		if (rgb[i] > 0.04045)
			rgb[i] = Math.pow(((rgb[i] + 0.055) / 1.055), 2.4);
		else
			rgb[i] /= 12.92;

		rgb[i] = rgb[i] * 100;
	}

	xyz = [
		rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805,
		rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722,
		rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505
		];

	return [
		xyz[0] / (xyz[0] + xyz[1] + xyz[2]),
		xyz[1] / (xyz[0] + xyz[1] + xyz[2])
		];
}


function rgb2hsl(reg, green, blue){
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
    
    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
}

function brightnessToHue(value){
	return Math.floor(_getBoundedValue(value, 0, 100) * (255 / 100));
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

module.exports = {
	rgb2xyz: rgb2xyz
};
