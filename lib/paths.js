function getApiPath(username) {
    var url = "/api";
    if (username)
        url += "/" + username;
    return url;
}

function getApiLightsPath(username, lightId) {
    var url = getApiPath(username) + "/lights";
    if (lightId)
        url += "/" + lightId;
    return url;
}

function getApiLightStatePath(username, lightId) {
    return getApiLightsPath(username, lightId) + "/state";
}


// Export the methods for the module
module.exports = {
    api: getApiPath,
    lights: getApiLightsPath,
    lightState: getApiLightStatePath
};