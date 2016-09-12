exports.combine = function(obj, values) {
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
};

exports.getBounded = function(value, min, max) {
    if (isNaN(value))
        value = min;

    if (value < min)
        return min;
    else if (value > max)
        return max;
    else
        return value;
};

exports.brightnessToHue = function(value) {
    return Math.floor(exports.getBounded(value, 0, 100) * (255 / 100));
};
