function nupnpPath() {
    return "/api/nupnp";
}

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

function getApiGroupPath(username, groupID) {
    var url = getApiPath(username) + "/groups";
    if (groupID)
        url += "/" + groupID;
    return url;
}

function getApiGroupPathState(username, groupID) {
    return getApiGroupPath(username, groupID) + "/action";
}
function getApiLightStatePath(username, lightId) {
    return getApiLightsPath(username, lightId) + "/state";
}

module.exports = {
    nupnp: nupnpPath,
    api: getApiPath,
    lights: getApiLightsPath,
    lightState: getApiLightStatePath,
    groups: getApiGroupPath,
    groupState: getApiGroupPathState
};