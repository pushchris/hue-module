function getApiPath(username) {
    var url = "/api";
    if (username)
        url += "/" + username;
    return url;
}

function getApiLightsPath(username, lightID) {
    var url = getApiPath(username) + "/lights";
    if (lightID)
        url += "/" + lightID;
    return url;
}

function getApiLightStatePath(username, lightId) {
    return getApiLightsPath(username, lightId) + "/state";
}

module.exports = {
    api: getApiPath,
    lights: getApiLightsPath,
    lightState: getApiLightStatePath
};