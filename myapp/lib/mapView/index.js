var d3 = require("d3");
var L = require("leaflet");

function initMap() {
    var map = L.map("map", {
        zoomDelta: 0.1,
        zoomSnap: 0.5
    }).setView([22.581023, 113.900337], 12);
    var osmUrl =
        "https://api.mapbox.com/styles/v1/mrfree/cjey70d4p3zik2so7zlwfws32/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJmcmVlIiwiYSI6ImNqZWR4MDM4ZzB6eHMzM28ycWtxcjRuOXEifQ._9nOwiQoVwA974vWGY2vRg",
        layer =
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    L.tileLayer(osmUrl, {
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
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");
        svg.append("circle")
        .attr("class","")
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
}

module.exports = {
    initMap: initMap,
    addSvgOverLay: addSvgOverLay
};g