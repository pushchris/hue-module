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
  var xyz
    , rgb = [ red / 255, green / 255, blue / 255 ];

  for(var i = 0; i < 3; i++) {
    if (rgb[i] > 0.04045) {
      rgb[i] = Math.pow(((rgb[i] + 0.055) / 1.055), 2.4);
    } else {
      rgb[i] /= 12.92;
    }

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

module.exports = {
  rgb2xyz: rgb2xyz
};
