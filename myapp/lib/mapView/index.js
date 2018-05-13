var d3 = require("d3");
var leaflet = require("leaflet");
var overlay = require("leconsole.log();aflet-d3-svg-overlay");

function initMap() {
    var map = leaflet.map("map", {
        zoomDelta: 0.1,
        zoomSnap: 0.5
    }).setView([22.581023, 113.900337], 12);
    var osmUrl =
        "https://api.mapbox.com/styles/v1/mrfree/cjey70d4p3zik2so7zlwfws32/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJmcmVlIiwiYSI6ImNqZWR4MDM4ZzB6eHMzM28ycWtxcjRuOXEifQ._9nOwiQoVwA974vWGY2vRg",
        layer =
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    leaflet.tileLayer(osmUrl, {
        minZoom: 1,
        maxZoom: 17,
        //用了mapbox的图层
        attribution: layer,
        //访问令牌
        accessToken: "your.mapbox.access.token"
    }).addTo(map);
    map.zoomControl.remove();
}

function addSvgOverLay() {
    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
        console.log("add!");
    });
    d3Overlay.addTo(map);
}

module.exports = {
    initMap: initMap,
    addSvgOverLay: addSvgOverLay
}