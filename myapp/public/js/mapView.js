var mapView = (function () {
    var map = L.map("map", {
        zoomDelta: 0.1,
        zoomSnap: 0.1
    }).setView([22.631023, 114.164337], 10.8);
    var osmUrl =
        "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9ja25vbm8iLCJhIjoiY2poN2ppZHptMDM2bDMzbnhiYW9icjN4MiJ9.GalwMO67A3HawYH_Tg0-Qg",
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

    map.on('click', function (e) {

        var top = 22.80550
        var bottom = 22.454
        var left = 113.75643
        var right = 114.65191
        var lat = e.latlng.lat
        var lng = e.latlng.lng
        var sideLength = (right - left) / 150
        var rowWidth = 2 * sideLength * Math.cos((Math.PI / 180) * 30)
        var colCount = parseInt((right - left) / rowWidth)
        var rowCount = parseInt(((top - bottom) / (3 * sideLength)) * 2)

        var row = parseInt(Math.round((top - lat) / (1.5 * sideLength)))
        if (row % 2 == 0) {
            col = (Math.round((lng - left) / rowWidth))
        } else if (row % 2 != 0) {
            col = (Math.round((lng - left - sideLength * Math.cos((Math.PI / 180) * 30)) / rowWidth))
        }
        var position = col * rowCount + (row + 1)

    })

    //.range(['#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#e41a1c', ]);

    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
        //addHexagonBorder(selection, projection);

        addHexagon(selection, projection, 7);
        //addPrismBorder(selection);
    }, {
        zoomDraw: false,
    });
    d3Overlay.addTo(map);

    function showDiv() {
        d3.select("#suspendingDiv").transition()
            .duration(1000)
            .style("top", "250px");
    }

    function hideDiv() {
        d3.select("#suspendingDiv").transition()
            .duration(1000)
            .style("top", "-210px");
    }

    function suspedingViewForOneHexagon(row, col, classId) {
        showDiv();
        var svg = d3.select('#suspendingSvg');
        var width = parseFloat(svg.style("width").split('px')[0]),
            height = parseFloat(svg.style("height").split('px')[0]);

        var tierRadius = 30;
        var arc = d3
            .arc()
            .startAngle(function (d) {
                return d.startAngle;
            })
            .endAngle(function (d) {
                return d.endAngle;
            })
            .innerRadius(function (d) {
                return d.innerRadius;
            })
            .outerRadius(function (d) {
                return d.outerRadius;
            });
        d3.json(options.rootPath + 'classClickData.json', function (classClickData) {
            getSuspendingData(row, col).then(function (suspedingData) {
                svg.selectAll("path").remove();
                svg.selectAll("circle").remove();

                var thisClassMaxOn = d3.max(classClickData[classId].con);



                var thisClassMaxOff = d3.max(classClickData[classId].off);
                /* 
                                var thisClassMaxOn = d3.max(suspedingData.con);
                                var thisClassMaxOff = d3.max(suspedingData.off);
                 */
                var circleRadius = 50;

                var onScale = d3.scaleLinear()
                    .domain([0, thisClassMaxOn])
                    .range([0, tierRadius]);
                var offScale = d3.scaleLinear()
                    .domain([0, thisClassMaxOff])
                    .range([0, -tierRadius]);

                var arcArray = [];

                for (var i = 0; i < suspedingData.con.length; i++) {
                    var thisArc = new Object();
                    thisArc.value = suspedingData.con[i];
                    thisArc.startAngle = 2 * Math.PI / 24 * i;
                    thisArc.endAngle = 2 * Math.PI / 24 * (i + 1);
                    thisArc.innerRadius = circleRadius;
                    thisArc.outerRadius = circleRadius + onScale(suspedingData.con[i]);
                    arcArray.push(thisArc);
                }

                var flArcsG = svg.append("g").attr("class", "arcG")
                    .attr("transform", "translate(" + (width / 2) + ',' + (height / 2) + ')');

                var fl = flArcsG
                    .selectAll(".path")
                    .data(arcArray)
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .style("stroke", "black")
                    .style("stroke-width", "0.2px")
                    .style("fill", function (d) {
                        return options.suspending_outer_color;
                    })

                arcArray = [];
                for (var i = 0; i < suspedingData.off.length; i++) {
                    var thisArc = new Object();
                    thisArc.value = suspedingData.off[i];
                    thisArc.startAngle = 2 * Math.PI / 24 * i;
                    thisArc.endAngle = 2 * Math.PI / 24 * (i + 1);
                    thisArc.innerRadius = circleRadius;
                    thisArc.outerRadius = circleRadius + offScale(suspedingData.off[i]);
                    arcArray.push(thisArc);
                }

                var flArcsG = svg.append("g").attr("class", "arcG")
                    .attr("transform", "translate(" + (width / 2) + ',' + (height / 2) + ')');

                var fl = flArcsG
                    .selectAll(".path")
                    .data(arcArray)
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .style("stroke", "black")
                    .style("stroke-width", "0.2px")
                    .style("fill", function (d) {
                        return options.suspending_inner_color;
                    })


                var line = d3.line()
                    .x(function (d) {
                        return d[0];
                    })
                    .y(function (d) {
                        return d[1];
                    })
                    .curve(d3.curveCardinal);
                addLine();

                function addLine() {
                    svg.selectAll(".baseLine").remove();
                    let a0 = 360 / classClickData[classId].con.length;
                    var lineEndPoint = getCurveData(onScale, classClickData[classId].con);
                    svg.append("path")
                        .attr("d", line(lineEndPoint))
                        .style("stroke", "black")
                        .style("fill", "none")
                    var lineEndPoint2 = getCurveData(offScale, classClickData[classId].off);
                    svg.append("path")
                        .attr("d", line(lineEndPoint2))
                        .style("fill", "white")
                        .style("stroke", "black")
                        .attr("class", "baseLine")
                    // addCurveCircle();

                    function getCurveData(scale, data) {
                        var lineEndPoint = []
                        data.map((d, i) => {
                            let lineEndPointX =
                                (width / 2) + (circleRadius + scale(d)) * Math.cos(a0 * (i + 1) * Math.PI / 180);
                            let lineEndPointY =
                                (height / 2) + (circleRadius + scale(d)) * Math.sin(a0 * (i + 1) * Math.PI / 180);
                            lineEndPoint.push([lineEndPointX, lineEndPointY]);
                        })
                        lineEndPoint.push(lineEndPoint[0]);
                        return lineEndPoint
                    }

                    function addCurveCircle() {
                        lineEndPoint.map(d => {
                            svg.append("circle")
                                .attr("cx", d[0])
                                .attr("cy", d[1])
                                .attr("r", 1.5)
                                .attr("stroke", options.suspending_inner_color)
                                .attr("fill", "black")
                        })
                    }
                }
            });
        })


        /*    d3.json('data/drawData/clickData.json', function (clickData) {

               svg.selectAll("path").remove();
               svg.selectAll("circle").remove();
               var thisClassClickData = clickData[thisClass];
               var thisClassMaxOn = d3.max(thisClassClickData.on);
               var thisClassMaxOff = d3.max(thisClassClickData.off);
               var circleRadius = 50;
               var onScale = d3.scaleLinear()
                   .domain([0, thisClassMaxOn])
                   .range([0, tierRadius]);
               var offScale = d3.scaleLinear()
                   .domain([0, thisClassMaxOff])
                   .range([0, -tierRadius]);

               var arcArray = [];
               for (var i = 0; i < thisClassClickData.on.length; i++) {
                   var thisArc = new Object();
                   thisArc.value = thisClassClickData.on[i];
                   thisArc.startAngle = 2 * Math.PI / 24 * i;
                   thisArc.endAngle = 2 * Math.PI / 24 * (i + 1);
                   thisArc.innerRadius = circleRadius;
                   thisArc.outerRadius = circleRadius + onScale(thisClassClickData.on[i]);
                   arcArray.push(thisArc);
               }


               var flArcsG = svg.append("g").attr("class", "arcG")
                   .attr("transform", "translate(" + (width / 2) + ',' + (height / 2) + ')');

               var fl = flArcsG
                   .selectAll(".path")
                   .data(arcArray)
                   .enter()
                   .append("path")
                   .attr("d", arc)
                   .style("stroke", "black")
                   .style("stroke-width", "0.2px")
                   .style("fill", function (d) {
                       return options.suspending_outer_color;
                   })

               var arcArray = [];
               for (var i = 0; i < thisClassClickData.off.length; i++) {
                   var thisArc = new Object();
                   thisArc.value = thisClassClickData.off[i];
                   thisArc.startAngle = 2 * Math.PI / 24 * i;
                   thisArc.endAngle = 2 * Math.PI / 24 * (i + 1);
                   thisArc.innerRadius = circleRadius;
                   thisArc.outerRadius = circleRadius + offScale(thisClassClickData.off[i]);
                   arcArray.push(thisArc);
               }

               var flArcsG = svg.append("g").attr("class", "arcG")
                   .attr("transform", "translate(" + (width / 2) + ',' + (height / 2) + ')');

               var fl = flArcsG
                   .selectAll(".path")
                   .data(arcArray)
                   .enter()
                   .append("path")
                   .attr("d", arc)
                   .style("stroke", "black")
                   .style("stroke-width", "0.2px")
                   .style("fill", function (d) {
                       return options.suspending_inner_color;
                   })


               var line = d3.line()
                   .x(function (d) {
                       return d[0];
                   })
                   .y(function (d) {
                       return d[1];
                   })
                   .curve(d3.curveCardinal);


               addCircle();
               // addLine();

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
                       .style("fill", options.suspending_outer_color)


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
                               .attr("stroke", options.suspending_inner_color)
                               .attr("fill", "black")
                       })
                   }
               }
           }) */
    }


    function addPrismBorder(selection) {
        var borderLine = d3.line()
            .x(function (d) {
                return map.latLngToLayerPoint(d).x
            })
            .y(function (d) {
                return map.latLngToLayerPoint(d).y
            })

        d3.json('data/drawData/bound202.json', (error, prismBorder) => {
            prismBorder.map(function (d) {
                selection.append('path')
                    .attr("d", borderLine(d.path))
                    .attr("stroke", "black")
                    .attr("fill", "none")
            })
        })
    }


    function addHexagonBorder(selection, projection) {
        var borderLine = d3.line()
            .x(function (d) {
                return map.latLngToLayerPoint(d).x
            })
            .y(function (d) {
                return map.latLngToLayerPoint(d).y
            })


        getBorderLineData().then(function (borderData) {
            let classNumber = d3.max(borderData, function (d) {
                return d.class
            })
            classDomain = []
            for (var i = 0; i <= classNumber; i++) {
                classDomain.push(i)
            }
            options.classScale.domain(classDomain);
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
                    return options.classScale(d.class);
                })
                .on("mouseover", function (d) {
                    odView.addLineInClass(d.category);
                    d3.select(this).style("opacity", options.mouseover_opacity);
                    d3.select("#netSvg").select("[id='" + d.class + "']")
                        .style("stroke", "black")
                        .style("stroke-width", 2)
                    pieViewForOneClass(d.class);
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("opacity", options.normal_opacity);
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
    var curClass = -1;

    function addHexagon(selection, projection, clusterNumber) {
        d3.json(options.rootPath + 'matrixCluster.json', (error, hexagonData) => {
            d3.json(options.rootPath + 'odIn.json', (error, odInData) => {
                var hexLine = d3.line()
                    .x(function (d) {
                        return map.latLngToLayerPoint(d).x
                    })
                    .y(function (d) {
                        return map.latLngToLayerPoint(d).y
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

                        if (d.category == -1) {
                            d3.select(this).remove()
                        } else {
                            return options.areaScale(d.category);
                        }
                    })
                    .attr("id", function (d) {
                        return d.category
                    })
                    .attr("areaClass", function (d) {
                        return d.area
                    })
                    .style("cursor", "crosshair")
                    .style("opacity", options.normal_opacity)
                    .style("stroke", "black")
                    .style("stroke-width", 0.1)
                    .on("click", d => {
                        if (curClass === -1) {
                            curClass = d.category;
                            pieView.pieViewInClass(d.category);
                            odView.addLineInClass(d.category, odInData);
                            selection.selectAll("[id='" + d.category + "']")
                                .style("opacity", options.mouseover_opacity)
                                .style("stroke-width", 1)
                            d3.select("#netSvg").select("[id='" + d.category + "']")
                                .style("stroke", "black")
                                .style("stroke-width", 2)
                            suspedingViewForOneHexagon(d.row, d.col, d.category);
                        } else if (curClass === d.category) {
                            curClass = -1
                            selection.selectAll("[id='" + d.category + "']")
                                .style("opacity", options.normal_opacity)
                                .style("stroke-width", 0.1)
                            d3.select("#netSvg").select("[id='" + d.category + "']")
                                .style("stroke", "none")
                            odView.addLineInClass(-1, odInData);
                            hideDiv();
                        } else if (curClass != d.category && curClass != -1) {
                            selection.selectAll("[id='" + curClass + "']")
                                .style("opacity", options.normal_opacity)
                            selection.selectAll("[id='" + curClass + "']")
                                .style("stroke-width", 0.1)
                            d3.select("#netSvg").select("[id='" + curClass + "']")
                                .style("stroke", "none")
                            hideDiv();
                            curClass = d.category;
                            pieView.pieViewInClass(d.category);
                            odView.addLineInClass(d.category, odInData);
                            selection.selectAll("[id='" + d.category + "']")
                                .style("opacity", options.mouseover_opacity)
                                .style("stroke-width", 1)
                            d3.select("#netSvg").select("[id='" + d.category + "']")
                                .style("stroke", "black")
                                .style("stroke-width", 2)
                            suspedingViewForOneHexagon(d.row, d.col, d.category);
                        }
                    })
                    .on("mouseover", function (d) {

                        d3.select(this).style("stroke-width", 1);

                        suspedingViewForOneHexagon(d.row, d.col, d.category);
                    })
                    .on("mouseout", function (d) {
                        if (curClass != d.category) {
                            d3.select(this).style("stroke-width", 0.1);
                        }
                        hideDiv();
                    })
                /* if (d.category == 6) {
                        selection.selectAll("[id='" + d.category + "']")
                            .style("fill", "black")
                        selection.selectAll("[id='" + 16 + "']")
                            .style("fill", "yellow")
                    }
                    selection.selectAll("[id='" + d.category + "']")
                        .style("fill", "black")
                    
                })
                */
                /* .on("mouseout", d => {
                    selection.selectAll("[id='" + d.category + "']")
                        .style("opacity", options.normal_opacity)
                        .style("stroke-width", 0.1)
                    d3.select("#netSvg").select("[id='" + d.category + "']")
                        .style("stroke", "none")
                    hideDiv();
                }) */
            })
        })
    }


    function getBorderLineData() {
        return new Promise(function (resolve, reject) {
            d3.json('./data/drawData/bound202.json', function (d) {
                resolve(d);
            })
        });

        /*  return new Promise(function (resolve, reject) {
             $.ajax({
                 method: "get",
                 url: "/showBorderLine",
                 success: function (data) {
                     resolve(data);
                 },
                 error: function () {

                 }
             });
         }); */
    }

    function getSuspendingData(row, col) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "get",
                url: "/" + options.clusterNumber.toString() + "/showSuspending",
                data: {
                    row: row,
                    col: col,
                    clusterNumber: options.clusterNumber,
                    status: options.status,

                },
                success: function (data) {
                    resolve(data[0]);
                },
                error: function () {

                }
            });
        });
    }



    function selectEffect(selection) {
        selection.style("stroke-width", 1);
    }
    return {
        suspedingViewForOneHexagon: suspedingViewForOneHexagon,
        showDiv: showDiv,
        hideDiv: hideDiv,
        selectEffect: selectEffect
    };
})()