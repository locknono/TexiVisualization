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

var classScale = d3.scaleOrdinal()
.domain([])
.range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628',
    '#f781bf', '#999999'
]);


d3.json('data/drawData/valueHexagon2.0_215.json', (error, hexagonData) => {
    console.log(hexagonData);
    var range = d3.extent(hexagonData, function (d) {
        return d.value;
    });
    var scale = d3.scaleLinear()
        .domain(range)
        .range([0, 1]);
    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
        addHexagonBorder();
    }, {
        zoomDraw: false,
    });
    d3Overlay.addTo(map);
})


function addHexagonBorder() {
    d3.json('data/drawData/bound.json', function (error, boundData) {
        var borderLine = d3.line()
            .x(function (d) {
                return projection.latLngToLayerPoint(d.split('-')).x
            })
            .y(function (d) {
                return projection.latLngToLayerPoint(d.split('-')).y
            })
        var bound = []
        for (var p in boundData) {
            bound.push(boundData[p])
        }
        console.log('bound: ', bound);
        console.log('boundData: ', boundData);
        selection.append("g")
            .selectAll("path")
            .data(bound)
            .enter()
            .append("path")
            .attr("d", function (d) {
                return borderLine(d)
            })
            .attr("stroke", "black")
            .style("fill", function (d, i) {
                return classScale(i);
            })
    })
}

function addHexagon() {
    var hexLine = d3.line()
    .x(function (d) {
        return projection.latLngToLayerPoint(d).x
    })
    .y(function (d) {
        return projection.latLngToLayerPoint(d).y
    })
    selection.append("g")
        .selectAll("path")
        .data(hexagonData)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return hexLine(d.path)
        })
        .attr("class", "hex")
        .style("pointer-events", "auto")
        .style("fill", function (d) {
            if (parseFloat(d.category) == 21) {
                return 'black'
            }
            return classScale(d.category);
        })
        .style("opacity", function (d) {
            if (d.category === -1) {
                return '0'
            }
            return "0.5"
        })
        .on("click", function (d) {
            console.log(d.category, d.value);
        })
}