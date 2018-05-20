var mapView = (function () {
    var map = L.map("map", {
        zoomDelta: 0.1,
        zoomSnap: 0.1
    }).setView([22.631023, 114.164337], 10.8);
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
            '#f781bf', '#999999'
        ]);

    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
        addHexagonBorder(selection, projection);
    }, {
        zoomDraw: false,
    });
    d3Overlay.addTo(map);

    function showDiv(){
        d3.select("#suspendingDiv").transition()
        .duration(1000)
        .style("top", "0px");
    }
    function hideDiv(){
        d3.select("#suspendingDiv").transition()
            .duration(1000)
            .style("top", "-200px");
    }
    function pieViewForOneClass(thisClass) {
        showDiv();
        var svg = d3.select('#suspendingSvg');
        var width = parseFloat(svg.style("width").split('px')[0]),
            height = parseFloat(svg.style("height").split('px')[0]);

        var minRadius = 30;

        d3.json('data/drawData/clickData.json', function (clickData) {

            var thisClassClickData = clickData[thisClass];

            var thisClassMaxOn = d3.max(thisClassClickData.on);
            var thisClassMaxOff = d3.max(thisClassClickData.off);

            var circleRadius = 50;
            var onScale = d3.scaleLinear()
                .domain([0, thisClassMaxOn])
                .range([0, 30]);
            var offScale = d3.scaleLinear()
                .domain([0, thisClassMaxOff])
                .range([0, -30]);

            var line = d3.line()
                .x(function (d) {
                    return d[0];
                })
                .y(function (d) {
                    return d[1];
                })
                .curve(d3.curveCardinal);


            svg.selectAll("path").remove();
            svg.selectAll("circle").remove();
            addCircle();
            addLine();

            function addCircle() {
                svg.append("circle")
                    .attr("cx", (width / 2))
                    .attr("cy", (height / 2))
                    .attr("r", circleRadius)
                    .attr("stroke", "black")
                    .attr("fill", "none")
            }

            function addLine() {
                var data = thisClassClickData.on;

                let a0 = 360 / data.length;
                var lineEndPoint = [];

                getCurveData(onScale);
                svg.append("path")
                    .attr("d", line(lineEndPoint))
                    .style("stroke", "black")
                    .style("fill", "#7972FF")

                svg.append("circle")
                    .attr("cx", (width / 2))
                    .attr("cy", (height / 2))
                    .attr("r", circleRadius)
                    .style("stroke", "black")
                    .style("fill", "#D6BD3E")


                var data = thisClassClickData.off;
                lineEndPoint = [];
                getCurveData(offScale);
                svg.append("path")
                    .attr("d", line(lineEndPoint))
                    .style("fill", "white")
                    .style("stroke", "black")
                // addCurveCircle();

                function getCurveData(scale) {
                    data.map((d, i) => {
                        let lineEndPointX =
                            (width / 2) + (circleRadius + scale(d)) * Math.cos(a0 * (i + 1) * Math.PI / 180);
                        let lineEndPointY =
                            (height / 2) + (circleRadius + scale(d)) * Math.sin(a0 * (i + 1) * Math.PI / 180);
                        lineEndPoint.push([lineEndPointX, lineEndPointY]);
                    })
                    lineEndPoint.push(lineEndPoint[0]);
                }

                function addCurveCircle() {
                    lineEndPoint.map(d => {
                        svg.append("circle")
                            .attr("cx", d[0])
                            .attr("cy", d[1])
                            .attr("r", 1.5)
                            .attr("stroke", "#CEDDE8")
                            .attr("fill", "black")
                    })
                }
            }
        })
    }

    function addHexagonBorder(selection, projection) {
        var borderLine = d3.line()
            .x(function (d) {
                return projection.latLngToLayerPoint(d).x
            })
            .y(function (d) {
                return projection.latLngToLayerPoint(d).y
            })

        getBorderLineData().then(function (borderData) {

            let classNumber = d3.max(borderData, function (d) {
                return d.class
            })
            classDomain = []
            for (var i = 0; i <= classNumber; i++) {
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
                .attr("class", "hex-border")
                .attr("id", function (d) {
                    return d.class
                })
                .attr("d", function (d) {
                    return borderLine(d.path)
                })
                .style("fill", function (d) {
                    return classScale(d.class);
                })
                .on("mouseover", function (d) {
                    d3.select(this).style("opacity", 1);
                    d3.select("#netSvg").select("[id='" + d.class + "']")
                        .style("stroke", "black")
                        .style("stroke-width", 2)
                    pieViewForOneClass(d.class);

                })
                .on("mouseout", function (d) {
                    d3.select(this).style("opacity", 0.6);
                    d3.select("#netSvg").select("[id='" + d.class + "']")
                        .style("stroke", "none")
                    hideDiv();
                })
            /* .on("click", function (d) {
                d3.select(this).style("opacity", 1);
                d3.select("#netSvg").select("[id='" + d.class + "']")
                    .style("stroke", "black")
                    .style("stroke-width", 2)

                pieViewForOneClass(d.class);
            }) */
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
    return {
        classScale: classScale,
        pieView:pieViewForOneClass,
        showDiv:showDiv,
        hideDiv:hideDiv
    };
})()