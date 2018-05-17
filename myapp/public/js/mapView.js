var map = L.map("map", {
    zoomDelta: 0.5,
    zoomSnap: 0.5
}).setView([22.631023, 114.080337], 11.5);
var osmUrl =
    "https://api.mapbox.com/styles/v1/locknono/cjh7jj0mo0yu32rlnk52glz3f/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9ja25vbm8iLCJhIjoiY2poN2ppZHptMDM2bDMzbnhiYW9icjN4MiJ9.GalwMO67A3HawYH_Tg0-Qg",
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
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628',
        '#f781bf', '#999999']);

var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
    addHexagonBorder(selection, projection);
}, {
    zoomDraw: false,
});
d3Overlay.addTo(map);


function addHexagonBorder(selection, projection) {
    var borderLine = d3.line()
        .x(function (d) {
            return projection.latLngToLayerPoint(d).x
        })
        .y(function (d) {
            return projection.latLngToLayerPoint(d).y
        })

    getBorderLineData().then(function (borderData) {
        
        let classNumber=d3.max(borderData,function(d){
            return d.class
        })
        classDomain=[]
        for(var i =0;i<=classNumber;i++){
            classDomain.push(i)
        }
        classScale.domain(classDomain);

        console.log('borderData: ', borderData);
        selection.append("g")
            .selectAll("path")
            .data(borderData)
            .enter()
            .append("path")
            .style("pointer-events", "auto")
            .attr("class","hex-border")
            .attr("id",function(d){
                return d.class
            })
            .attr("d", function (d) {
                return borderLine(d.path)
            })
            .style("fill", function (d) {
                return classScale(d.class);
            })
            .on("mouseover",function(d){
                d3.select(this).style("opacity",1);
                d3.select("#netSvg").select("[id='"+d.class+"']")
                .style("stroke","black")
                .style("stroke-width",2)
            })
            .on("mouseout",function(d){
                d3.select(this).style("opacity",0.6);
                d3.select("#netSvg").select("[id='"+d.class+"']")
                .style("stroke","none")
            })

            .on("click", function (d) {
                console.log(d.class)
            })
    })
}

function addHexagon() {
    d3.json('data/drawData/valueHexagon2.0_215.json', (error, hexagonData) => {

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
                return classScale(d.category);
            })
            .style("opacity", function (d) {
                if (d.category === -1) {
                    return '0'
                }
                return "0.5"
            })
            /* .on("click", function (d) {
                console.log(d.category, d.value);
            }) */
    })
}


function getBorderLineData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: "/showBorderLine",
            success: function (data) {
                resolve(data);
            },
            error: function () {

            }
        });
    });
}