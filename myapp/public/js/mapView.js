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

    var _globalMaxOn = undefined;
    var _globalMaxOff = undefined;
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
            .style("top", "-400px");
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
            console.log('classClickData: ', classClickData);
            getSuspendingData(row, col).then(function (suspedingData) {
                svg.selectAll("path").remove();
                svg.selectAll("circle").remove();

                if (options.globalFlag === false) {
                    //var thisClassMaxOn = d3.max(classClickData[classId].con);
                    var thisClassMaxOn=Math.log2(classClickData[classId].cmax);
                    var thisClassMaxOff=Math.log2(classClickData[classId].coff);
                   // var thisClassMaxOff = d3.max(classClickData[classId].off);
                } else {
                    if (_globalMaxOn === undefined) {
                        console.log("a");
                        //global
                        /* var thisClassMaxOn = d3.max(classClickData, function (d) {
                            return d3.max(d.con, function (e) {
                                return Math.log2(e + 1);
                            })
                        }) */
                        //_globalMaxOn = thisClassMaxOn;
                        var thisClassMaxOn=10.027708570144931;
                        _globalMaxOn = 10.027708570144931
                        /* var thisClassMaxOff = d3.max(classClickData, function (d) {
                            return d3.max(d.off, function (e) {
                                return Math.log2(e + 1);
                            })
                        }) */
                        //_globalMaxOff = thisClassMaxOff
                        var thisClassMaxOff=9.361003805166282;
                        _globalMaxOff = 9.361003805166282
                    } else {
                        var thisClassMaxOn = _globalMaxOn;
                        var thisClassMaxOff = _globalMaxOff;
                    }
                }


                var circleRadius = 50;

                var onScale = d3.scaleLinear()
                    .domain([0, thisClassMaxOn])
                    .range([0, tierRadius])
                var offScale = d3.scaleLinear()
                    .domain([0, thisClassMaxOff])
                    .range([0, -tierRadius])

                var arcArray = [];

                for (var i = 0; i < suspedingData.con.length; i++) {
                    var thisArc = new Object();
                    thisArc.value = suspedingData.con[i];
                    thisArc.startAngle = 2 * Math.PI / 24 * i;
                    thisArc.endAngle = 2 * Math.PI / 24 * (i + 1);
                    thisArc.innerRadius = circleRadius;
                    if (options.globalFlag === true) {
                        thisArc.outerRadius = circleRadius + onScale(Math.log2(suspedingData.con[i] + 1));
                    } else {
                        thisArc.outerRadius = circleRadius + onScale(Math.log2(suspedingData.con[i] + 1));
                    }
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
                        return options.pieview_colorscale(0.7);
                    })

                arcArray = [];
                for (var i = 0; i < suspedingData.off.length; i++) {
                    var thisArc = new Object();
                    thisArc.value = suspedingData.off[i];
                    thisArc.startAngle = 2 * Math.PI / 24 * i;
                    thisArc.endAngle = 2 * Math.PI / 24 * (i + 1);
                    thisArc.innerRadius = circleRadius;
                    if (options.globalFlag === true) {
                        thisArc.outerRadius = circleRadius + offScale(Math.log2(suspedingData.off[i] + 1));
                    } else {
                        thisArc.outerRadius = circleRadius +  offScale(Math.log2(suspedingData.off[i] + 1));
                    }
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
                        return options.pieview_colorscale(0.2);
                    })

                //add BaseLine
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

                    function getCurveData(scale, data) {
                        var lineEndPoint = []
                        data.map((d, i) => {
                            if (options.globalFlag === true) {
                                var lineEndPointX =
                                    (width / 2) + (circleRadius + scale(Math.log2(d + 1))) * Math.cos(a0 * (i + 1) * Math.PI / 180);
                                var lineEndPointY =
                                    (height / 2) + (circleRadius + scale(Math.log2(d + 1))) * Math.sin(a0 * (i + 1) * Math.PI / 180);
                            } else {
                                var lineEndPointX =
                                    (width / 2) + (circleRadius + scale((d))) * Math.cos(a0 * (i + 1) * Math.PI / 180);
                                var lineEndPointY =
                                    (height / 2) + (circleRadius + scale((d))) * Math.sin(a0 * (i + 1) * Math.PI / 180);
                            }
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
        })
    }
    var curHex = [];

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
                    .on("click", function (d) {
                        if (window.event.ctrlKey) {
                            //选中一个类的时候直接取消一个六边形的选中
                            d3.select(curHex[0]).style("opacity", options.normal_opacity).style("stroke-width", 0.1);
                            curHex.shift();
                            hideDiv();
                            if (options.curClass === -1) {
                                options.curClass = d.category;
                                pieView.pieViewInClass(d.category, undefined, undefined);
                                odView.addLineInClass(d.category, odInData);
                                selection.selectAll("[id='" + d.category + "']")
                                    .style("opacity", options.mouseover_opacity)
                                    .style("stroke-width", 1)
                                d3.select("#netSvg").select("[id='" + d.category + "']")
                                    .style("stroke", "black")
                                    .style("stroke-width", 2)
                            } else if (options.curClass === d.category) {
                                options.curClass = -1;
                                pieView.pieViewAll();
                                selection.selectAll("[id='" + d.category + "']")
                                    .style("opacity", options.normal_opacity)
                                    .style("stroke-width", 0.1)
                                d3.select("#netSvg").select("[id='" + d.category + "']")
                                    .style("stroke", "none")
                                odView.addLineInClass(-1, odInData);
                                hideDiv();
                            } else if (options.curClass != d.category && options.curClass != -1) {

                                selection.selectAll("[id='" + options.curClass + "']")
                                    .style("opacity", options.normal_opacity)
                                    .style("stroke-width", 0.1)
                                d3.select("#netSvg").select("[id='" + options.curClass + "']")
                                    .style("stroke", "none")
                                hideDiv();
                                options.curClass = d.category;
                                pieView.pieViewInClass(options.curClass, undefined, undefined);
                                odView.addLineInClass(d.category, odInData);
                                selection.selectAll("[id='" + d.category + "']")
                                    .style("opacity", options.mouseover_opacity)
                                    .style("stroke-width", 1)
                                d3.select("#netSvg").select("[id='" + d.category + "']")
                                    .style("stroke", "black")
                                    .style("stroke-width", 2)
                            }
                        } else {
                            //点击了当前选中的，也就是取消选中一个六边形的的情况
                            if (curHex.length > 0 && curHex[0] == this) {
                                //如果点击的和当前选中的是同一个:如果当前选中了这一类，就归为普通的类的样式，饼图展示这一类
                                //如果当前没有选中这一类，变成普通的样式，饼图展示当前的类
                                if (curHex[0].id == options.curClass) {
                                    d3.select(curHex[0]).style("opacity", options.mouseover_opacity).style("stroke-width", 1);
                                    if (options.curClass != -1) {
                                        pieView.pieViewInClass(classId = options.curClass, undefined, undefined);
                                    } else {
                                        pieView.pieViewAll();
                                    }
                                } else {
                                    d3.select(curHex[0]).style("opacity", options.normal_opacity).style("stroke-width", 0.1);
                                    if (options.curClass != -1) {
                                        pieView.pieViewInClass(classId = options.curClass, undefined, undefined);
                                    } else {
                                        pieView.pieViewAll();
                                    }
                                }
                                hideDiv();
                                curHex.shift();
                                return
                            }
                            //选中另一个正六边形的情况
                            if (curHex.length > 0 && curHex[0] !== this) {
                                let filePath = options.rootPath + 'eachOdData/' + d.row + '_' + d.col + '.json';

                                d3.json(filePath, function (data) {
                                    odView.addLineInClass(undefined, data);
                                })
                                if (curHex[0].id == options.curClass) {
                                    d3.select(curHex[0]).style("opacity", options.mouseover_opacity).style("stroke-width", 1);
                                } else {
                                    d3.select(curHex[0]).style("opacity", options.normal_opacity).style("stroke-width", 0.1);
                                }
                            }
                            curHex[0] = this;
                            let filePath = options.rootPath + 'eachOdData/' + d.row + '_' + d.col + '.json';

                            d3.json(filePath, function (data) {
                                //odView.addLineInClass(undefined, data);
                            })
                            suspedingViewForOneHexagon(d.row, d.col, d.category);
                            pieView.pieViewInClass(classId = undefined, row = d.row, col = d.col);
                            d3.select(curHex[0]).style("opacity", options.mouseover_opacity + 0.1).style("stroke-width", 2);
                        }
                    })
            })
        })
    }


    function getBorderLineData() {
        return new Promise(function (resolve, reject) {
            d3.json('./data/drawData/bound202.json', function (d) {
                resolve(d);
            })
        });
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