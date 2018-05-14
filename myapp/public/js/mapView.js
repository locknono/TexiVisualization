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
d3.json('data/drawData/valueHexagon3.json', (error, hexagonData) => {
    /* hexagonData.map(function (d) {
        d.value = Math.log2(d.value + 1);
    }) */
    console.log(hexagonData);
    var range = d3.extent(hexagonData, function (d) {
        return d.value;
    });
    var scale = d3.scaleLinear()
        .domain(range)
        .range([0, 1]);
    console.log('range: ', range);

    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {

        var line = d3.line()
            .x(function (d) {
                return projection.latLngToLayerPoint(d).x
            })
            .y(function (d) {
                return projection.latLngToLayerPoint(d).y
            })

        /*  map.on("click", function (e) {
             console.log(e.latlng);
             selection.selectAll("g").remove();
         }) */
        selection.append("path")
            .attr("d", function (d) {

                var [top,bottom,left,right]=[22.76550,22.454,113.75643,114.35191];

                var [p1,p2,p3,p4]=[[top, left],[top, right],[bottom, right],[bottom, left]];
                
                return line([p1, p2, p3, p4, p1]);
            })
            .attr("stroke", "red")
            .attr("fill", "none");

        var classScale = d3.scaleOrdinal()
            .domain([])
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628',
                '#f781bf', '#999999'
            ]);
        // selection.selectAll("g").remove();

        var inter = d3.interpolateRgb('rgb(255,255,255)', 'rgb(0,0,0)');

        selection.append("g")
            .selectAll("path")
            .data(hexagonData)
            .enter()
            .append("path")
            .attr("d", function (d) {
                return line(d.path)
            })
            .style("stroke", "none")
            // .style("stroke-width",0.2)
            .style("fill", function (d) {
                if (d.category === -1) {
                    return 'white'
                }
                return classScale(d.category);
            })
            .style("pointer-events", "auto")
            .on("click", function (d) {
                console.log(d.category, d.value);
                //console.log(d.value);
            })
            //.attr("")
            .attr("fill-opacity", "0.5")
            .attr("fill", function (d) {
                return inter(scale(d.value))
            })
        selection.append("g")
            /*                        .selectAll("circle")
                                   .data(hexagonData)
                                   .enter() */
            .append("circle")
            .attr("cx", function (d) {
                var coors = projection.latLngToLayerPoint([22.523582, 113.814919]);
                return coors.x;
            })
            .attr("cy", function (d) {
                var coors = projection.latLngToLayerPoint([22.523582, 113.814919]);
                return coors.y;
            })
            .attr("r", 5)
            .attr("fill", "yellow")
    }, {
        zoomDraw: false,
    });
    d3Overlay.addTo(map);
})