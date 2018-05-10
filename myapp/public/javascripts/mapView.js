var map = L.map("map", {
    zoomDelta: 0.1,
    zoomSnap: 0.5
}).setView([30.669, 107.8718], 4);
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

var firstDraw = true;

var colorScale = d3.scaleOrdinal()
    .domain([])
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']);

//['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd']
var showParaFlag = false;
var stackFlag = false;
var spaceDisThr = 4.7;
var propDisThr = 2.72;
var cigma = 2;
var curSelectedMapClass = -1;
var voronoiR = 50;
var sitesData;
var gdpData;
var cluster_result;
var kmeansClusterData;
var kmeansClusterResult;
var axisOrder;
var clusterNumber;
var edge_data;
var node_data;
var originalClusterResult;
var mapColorBarG = d3.select("#colorRectSvg").append("g")
    .attr("class", "mapColorBarG");
var colorRectHeight = 18;
var colorRectWidth = 18;
var nuclearResult;
var paraResult;

function load(SystemName) {

    firstDraw = true;

    if ($('#my-checkboxid').prop('checked')) {
        showParaFlag = true;
    } else {
        showParaFlag = false;
    }

    if (SystemName == 'Air') {
        /*  showParaFlag = false;
         stackFlag = false; */
        spaceDisThr = 0.62; //0.62
        propDisThr = 1.43; //2.43
        voronoiR = 5;
        map.setView([29.544747, 120.779391], 7.5);
    } else if (SystemName == 'Wenzhou') {
        /*  showParaFlag = false;
         stackFlag = false; */
        spaceDisThr = 0.53;
        propDisThr = 2.1;
        voronoiR = 50;
        map.setView([41.89001, -87.700386], 10);
    }
    /*  var popup = L.popup();

               function onMapClick(e) {
                  popup
                      .setLatLng(e.latlng)
                      .setContent("You clicked the map at " + e.latlng.toString())
                      .openOn(map);
              }

              map.on('click', onMapClick); */

    Promise.all([getChinaPrvLocationData(SystemName), getChinaGDPData(SystemName), getComData(SystemName)]).then(function (values) {

        sitesData = values[0];
        gdpData = values[1];
        edge_data = values[2];
        if (SystemName === 'Wenzhou') {
            let wenzhouData = sitesData.sites;
            let wenzhouPropData = gdpData;
            var node_data = [];
            for (var i = 0; i < gdpData.length; i++) {
                node_data.push(gdpData[i].Prvcnm);
            }
            edge_data.forEach(function (d) {
                d.value = parseFloat(d.value);
            })
            var community = jLouvain().nodes(node_data).edges(edge_data);
            var result = community();
            var wenzhouClusterResult = [];
            for (var key in result) {
                var node = {};
                node.color = result[key];
                node.name = key;
                for (var j = 0; j < sitesData.sites.length; j++) {
                    if (key === sitesData.sites[j].name) {
                        node.position = [sitesData.sites[j].lat, sitesData.sites[j].lng];
                    }
                }
                var props = [];
                for (var j = 0; j < gdpData.length; j++) {
                    if (gdpData[j]['Prvcnm'] === key) {
                        //    
                        for (var key3 in gdpData[j]) {
                            if (key3 !== 'Prvcnm') {
                                props.push(parseFloat(gdpData[j][key3]));
                            }
                        }
                    }
                    node.props = props;
                }
                wenzhouClusterResult.push(node);
            }

            let com_cluster_number = d3.max(wenzhouClusterResult, function (d) {
                return d.color;
            })

            let usedResult = [];
            for (var i = 0; i < com_cluster_number + 1; i++) {
                let arr = [];
                for (var j = 0; j < wenzhouClusterResult.length; j++) {
                    if (wenzhouClusterResult[j].color === i) {
                        arr.push(wenzhouClusterResult[j]);
                    }
                }
                usedResult.push(arr);
            }
            cluster_result = usedResult;

            //fs.writeFileSync('result.json',cluster_result);

            /*  let wenzhouClusterData = [];
             for (var i = 0; i < wenzhouData.length; i++) {
                 var props = [];
                 for (var key in wenzhouPropData[i]) {
                     if (key !== 'Prvcnm') {
                         props.push(parseFloat(wenzhouPropData[i][key]));
                     }
                 }
                 var node = [wenzhouData[i].lat, wenzhouData[i].lng];
                 node.position = [wenzhouData[i].lat, wenzhouData[i].lng];
                 node.name = wenzhouData[i].name;
                 node.props = props;
                 wenzhouClusterData.push(node);
             } */

            colorScale = d3.scaleOrdinal()
                .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                .range(['#e31a1c', '#ffff99', '#33a02c', '#cab2d6', '#ffffb3', '#fdbf6f', '#ff7f00', '#b15928', '#6a3d9a', '#a6cee3', '#1f78b4', '#b2df8a', '#fb9a99', ]);
            // let keans = new KMeans();
            // wenzhouClusterResult = kmeans.cluster(wenzhouClusterData, 7)
            /*
                        let usedResult = [];
                        for (var i = 0; i < wenzhouClusterResult.length; i++) {
                            usedResult[i] = [];
                            for (var j = 0; j < wenzhouClusterResult[i].length; j++) {
                                let node = {};
                                node.name = wenzhouClusterResult[i][j].name;
                                node.position = wenzhouClusterResult[i][j].position;
                                node.props = wenzhouClusterResult[i][j].props;
                                node.color = i;
                                usedResult[i].push(node);
                            }
                        }
                        cluster_result = usedResult; */

        } else {
            cluster_result = gdpCluster(sitesData, gdpData, spaceDisThr, propDisThr);
        }
        cluster_result.sort(function (a, b) {

            if (a.length === b.length) {
                return a[0].position[0] - b[0].position[0];
            } else {
                return a.length - b.length;
            }
        });

        for (var i = 0; i < cluster_result.length; i++) {
            for (var j = 0; j < cluster_result[i].length; j++) {
                cluster_result[i][j].color = i;
            }
        }

        function addMapColorBar() {
            d3.select(".mapColorBarG").selectAll("rect").remove();
            d3.select(".mapColorBarG").selectAll("text").remove();
            d3.select(".mapColorBarG").selectAll("circle").remove();
            /* d3.select("#colorRectDiv")
                .style("width", (20 + (colorRectWidth + 3) * (cluster_result.length)) + "px") */
            d3.select("#colorRectDiv")
                .style("width", '28px')
                .style("height", (15 + (colorRectWidth + 2) * (cluster_result.length)) + "px")
            for (var i = 0; i < cluster_result.length; i++) {

                /* d3.select(".mapColorBarG").append("rect")
                    .attr("y", 5)
                    .attr("x", 20 + (colorRectWidth + 3) * i - 15)
                    .style("fill", colorScale(i))
                    .attr("width", colorRectWidth)
                    .attr("height", colorRectHeight); */
                /* d3.select(".mapColorBarG").append("circle")
                    .attr("cy", 15)
                    .attr("cx", 20 + (colorRectWidth + 3) * i )
                    .style("fill", colorScale(i))
                    .attr("r", 8); */
                d3.select(".mapColorBarG").append("circle")
                    .attr("cy", 15 + i * 20)
                    .attr("cx", 13)
                    .style("fill", colorScale(i))
                    .attr("r", 8);
            }
            /*  d3.select(".mapColorBarG").append("text")
                 .attr("x", 20 + (colorRectWidth + 3) * (cluster_result.length) - 10)
                 .attr("y", 20)
                 .style("font-size", "12px")
                 .attr("font-family", '"Helvetica Neue",Helvetica,Arial,sans-serif')
                 .attr("text-anchor", "start")
                 .text(cluster_result.length + " clusters") */
        }
        addMapColorBar();
        originalClusterResult = cloneObj(cluster_result);

        kmeansClusterData = getKmeansClusterData(gdpData);
        nuclearResult = nuclearDensity(gdpData);
        paraResult = changeNuclearFormat(nuclearResult);

        function changeNuclearFormat(nuclearResult) {
            var paraResult = [];

            for (var i = 0; i < nuclearResult.length; i++) {

                paraResult[i] = [];
                paraResult[i].name = nuclearResult[i].name;
                for (var j = 0; j < 1; j++) {
                    paraResult[i][j] = cloneObj(nuclearResult[i]);
                }

            }
            for (var i = 0; i < paraResult.length; i++) {
                for (var j = 0; j < paraResult[i].length; j++) {
                    for (var s = 0; s < paraResult[i][j].length; s++) {
                        for (var m = 0; m < paraResult[i][j][s].length; m++) {
                            let arr = [paraResult[i][j][s][m].value];

                            arr.name = paraResult[i][j][s][m].name;
                            paraResult[i][j][s][m] = arr;
                        }
                    }
                }
            }

            return paraResult;
        }

        kmeansClusterResult = kmeansCluster(kmeansClusterData);

        var usedParaCluster = [];
        for (var i = 0; i < kmeansClusterResult.length; i++) {
            usedParaCluster[i] = [];
            usedParaCluster[i].name = kmeansClusterResult[i].name;
            // parallelCluster[i] = $.grep(parallelCluster[i],function(n){ return n == 0 || n });
            // parallelCluster[i] = parallelCluster[i].filter(function(n){ return n != undefined }); 
            for (var j = 0; j < kmeansClusterResult[i].length; j++) {
                usedParaCluster[i][j] = [];
                for (var s = 0; s < kmeansClusterResult[i][j].length; s++) {
                    usedParaCluster[i][j][s] = kmeansClusterResult[i][j][s];
                }
            }
        }
        for (var i = 0; i < usedParaCluster.length; i++) {
            for (var j = usedParaCluster[i].length - 1; j >= 0; j--) {
                if (usedParaCluster[i][j] === undefined) {
                    usedParaCluster[i].splice(j, 1);
                }
            }
        }
        for (var i = 0; i < usedParaCluster.length; i++) {
            for (var j = 0; j < usedParaCluster[i].length; j++) {
                for (var s = usedParaCluster[i][j].length - 1; s >= 0; s--) {
                    if (usedParaCluster[i][j][s] === undefined) {
                        usedParaCluster[i][j].splice(s, 1);
                    }
                }
            }
        }
        kmeansClusterResult = usedParaCluster;

        kmeansClusterResult = paraResult;



        if (curSelectedMapClass === -1) {
            axisOrder = getMutualInfo(cluster_result, kmeansClusterResult);
        } else {
            axisOrder = getMutualInfo([cluster_result[curSelectedMapClass]], kmeansClusterResult);
        }


        addMarixView(axisOrder, cluster_result, SystemName);
        addRadarView(axisOrder, gdpData);

        var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
            if (curSelectedMapClass === -1) {
                axisOrder = getMutualInfo(cluster_result, kmeansClusterResult);
            } else {
                axisOrder = getMutualInfo([cluster_result[curSelectedMapClass]], kmeansClusterResult);
            }

            /*   selection.selectAll("g").remove(); */
            var circleG = selection.append("g")
                .attr("class", "mapCircleG");
            addVoronoi(sitesData, selection, projection, cluster_result, axisOrder, gdpData);
            changeClusterColor(selection, cluster_result);
            if (showParaFlag) {
                parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                    sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
            }



            if (firstDraw) {
                $(function () {
                    $("[name='my-checkbox']").bootstrapSwitch();
                    $("[name='my-checkbox2']").bootstrapSwitch();
                    $("#showPara span").on("click", function () {
                        if ($('#my-checkboxid').prop('checked')) {
                            showParaFlag = true;
                            selection.selectAll(".paraLineG").remove();
                            selection.selectAll(".axisTextG").remove();
                            selection.selectAll(".axisG").remove();
                            selection.selectAll(".intervalLineG").remove();
                            selection.selectAll(".prvDot").remove();
                            parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                                sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                        } else if (!$('#my-checkboxid').prop('checked')) {
                            showParaFlag = false;
                            selection.selectAll(".paraLineG").remove();
                            selection.selectAll(".axisTextG").remove();
                            selection.selectAll(".axisG").remove();
                            selection.selectAll(".intervalLineG").remove();
                            selection.selectAll(".prvDot").remove();
                        }
                    })
                    $("#stacked span").on("click", function () {
                        if ($('#my-checkboxid2').prop('checked')) {
                            stackFlag = true;
                            selection.selectAll(".paraLineG").remove();
                            selection.selectAll(".axisTextG").remove();
                            selection.selectAll(".axisG").remove();
                            selection.selectAll(".intervalLineG").remove();
                            selection.selectAll(".prvDot").remove();
                            if (showParaFlag) {
                                parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                                    sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                            }

                        } else if (!$('#my-checkboxid2').prop('checked')) {
                            stackFlag = false;
                            selection.selectAll(".paraLineG").remove();
                            selection.selectAll(".axisTextG").remove();
                            selection.selectAll(".axisG").remove();
                            selection.selectAll(".intervalLineG").remove();
                            selection.selectAll(".prvDot").remove();
                            if (showParaFlag) {
                                parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                                    sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                            }
                        }
                    })
                    //default : 4.7 2.72

                    $("#spaceDisSlider").slider({
                        value: spaceDisThr,
                        min: 0,
                        max: 10,
                        step: 0.001,
                        slide: function (event, ui) {
                            spaceDisThr = ui.value;
                            cluster_result = gdpCluster(sitesData, gdpData, spaceDisThr, propDisThr);

                            if (cluster_result.length >= 10) {
                                colorScale = d3.scaleOrdinal()
                                    .domain([])
                                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#8dd3c7', '#ffffb3',
                                        '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9',
                                        '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c',
                                        '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6'
                                    ]);
                            } else if (cluster_result.length < 10) {
                                colorScale = d3.scaleOrdinal()
                                    .domain([])
                                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']);
                            }
                            addMapColorBar();

                            //  changeClusterColor(selection, cluster_result);
                            var axisOrder = getMutualInfo(cluster_result, kmeansClusterResult);

                            addVoronoi(sitesData, selection, projection, cluster_result, axisOrder, gdpData);
                            changeClusterColor(selection, cluster_result);

                            if (showParaFlag) {
                                parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                                    sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                            }
                            addMarixView(axisOrder, cluster_result, SystemName);
                            curSelectedMapClass = -1;
                            $("#spaceDisAmount").val(ui.value);
                        }
                    });
                    $("#spaceDisAmount").val(spaceDisThr);
                    $("#propDisSlider").slider({
                        value: propDisThr,
                        min: 0.8,
                        max: 5,
                        step: 0.001,
                        slide: function (event, ui) {
                            propDisThr = ui.value;
                            cluster_result = gdpCluster(sitesData, gdpData, spaceDisThr, propDisThr);
                            if (cluster_result.length >= 10) {
                                colorScale = d3.scaleOrdinal()
                                    .domain([])
                                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#8dd3c7', '#ffffb3',
                                        '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9',
                                        '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c',
                                        '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6'
                                    ]);
                            } else if (cluster_result.length < 10) {
                                colorScale = d3.scaleOrdinal()
                                    .domain([])
                                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']);
                            }
                            addMapColorBar();

                            var axisOrder = getMutualInfo(cluster_result, kmeansClusterResult);
                            addVoronoi(sitesData, selection, projection, cluster_result, axisOrder, gdpData);
                            changeClusterColor(selection, cluster_result);

                            if (showParaFlag) {
                                parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                                    sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                            }
                            addMarixView(axisOrder, cluster_result, SystemName);

                            curSelectedMapClass = -1;
                            $("#propDisAmount").val(ui.value);
                        }
                    });
                    $("#propDisAmount").val(propDisThr);

                    $("#cigmaSlider").slider({
                        value: 2,
                        min: 0.01,
                        max: 10,
                        step: 0.001,
                        slide: function (event, ui) {
                            nuclearResult = nuclearDensity(gdpData, ui.value);
                            
                            paraResult = changeNuclearFormat(nuclearResult, ui.value);
                            kmeansClusterResult = paraResult;

                            if (curSelectedMapClass === -1) {
                                axisOrder = getMutualInfo(cluster_result, kmeansClusterResult);
                            } else {
                                axisOrder = getMutualInfo([cluster_result[curSelectedMapClass]], kmeansClusterResult);

                            }
                            
                            addRadarView(axisOrder, gdpData);
                            addVoronoi(sitesData, selection, projection, cluster_result, axisOrder, gdpData);
                            changeClusterColor(selection, cluster_result);
                            if (showParaFlag) {
                                parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                                    sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                            }
                            addMarixView(axisOrder, cluster_result, SystemName);

                            $("#cigmaAmount").val(ui.value);
                        }
                    });
                    $("#cigmaAmount").val(cigma);

                });
                firstDraw = false;
            }
        });
        d3Overlay.addTo(map);
    });

    function addVoronoi(sitesData, selection, projection, cluster_result, axisOrder, gdpData) {
        selection.selectAll(".clipPathG").remove();
        selection.selectAll(".voronoiG").remove();
        var data = sitesData.sites;
        selection.append("g")
            .attr("class", "clipPathG")
            .selectAll("clipPath")
            .data(data)
            .enter().append("clipPath")
            .attr("id", function (d, i) {
                return "clip-" + i;
            })
            .append("circle")
            .attr("cx", function (d, i) {
                var coors = projection.latLngToLayerPoint([d.lat, d.lng]);
                return coors.x;
            })
            .attr("cy", function (d, i) {
                var coors = projection.latLngToLayerPoint([d.lat, d.lng]);
                return coors.y;
            })
            .attr("r", voronoiR)

            .style("fill", "007FFF")
            .style("fill-opacity", "0.5");


        var points = [];

        for (var i = 0; i < data.length; i++) {
            var coors = projection.latLngToLayerPoint([data[i].lat, data[i].lng]);
            points.push([coors.x, coors.y]);
            points[i].name = data[i].name;
        }

        for (var i = 0; i < cluster_result.length; i++) {
            for (var j = 0; j < cluster_result[i].length; j++) {
                for (var s = 0; s < points.length; s++) {
                    if (points[s].name === cluster_result[i][j].name) {
                        points[s].class = cluster_result[i][j].color;
                        break;
                    }
                }
            }
        }

        var bounds = map.getBounds();




        var drawLimit = bounds.pad(0.4);
        var filteredPoints = points.filter(function (p) {
            var PointlatLng = map.layerPointToLatLng([p[0], p[1]]);
            var latlng = new L.LatLng(PointlatLng.lat, PointlatLng.lng);
            return drawLimit.contains(latlng);
        });


        var voronoi = d3.geom.voronoi()
            .x(function (d) {
                return d[0];
            })
            .y(function (d) {
                return d[1];
            });
        var voronoiPaths = voronoi(points);
        for (var i = voronoiPaths.length - 1; i >= 0; i--) {
            if (voronoiPaths[i] === undefined) {

                voronoiPaths.splice(i, 1);
            }
        }
        voronoiPaths.forEach(function (v) {
            // 
            v.point.cell = v;
        });

        /* var tip = d3
            .tip()
            .offset([150, 0])
            .attr("class", "d3-tip panel panel-default ")
            .style("opacity", 0.5)
            .html(function (d) {
                var text = '';
                var thisClass = d.class;
                for (var i = 0; i < cluster_result.length; i++) {
                    if (cluster_result[i][0].color === thisClass) {
                        for (var j = 0; j < cluster_result[i].length; j++) {
                            text += (cluster_result[i][j].name + '<br>');
                        }
                    }
                }
                
                
                return (
                    "<span style='color:black;position:a'>" +
                    text +
                    "</span>"
                );
            }); */

        var voronoiG = selection.append("g")
            .attr("class", "voronoiG")
            // .call(tip)
            .selectAll(".voronoiPath")
            .data(points)
            .enter();

        var buildPathFromPoint = function (point) {
            if (point.cell === undefined) {
                return;
            }
            return point.cell ? "M" + point.cell.join("L") + "Z" : null;
        }



        voronoiG.append("path")
            .attr("d", function (d, i) {
                if (d.cell === undefined) {

                }
                return buildPathFromPoint(d);
            })
            .attr("id", function (d, i) {

                return i;
            })
            .attr("clip-path", function (d, i) {
                return "url(#clip-" + i + ")";
            })
            .attr("stroke", "none")
            .attr("stroke-width", "1px")
            .attr("name", function (d, i) {
                return d.name;
            })
            .attr("mapClass", function (d, i) {
                return d.class;
            })

            .attr("class", "voronoiPath")
            .style("fill", "#007FFF")
            .style("pointer-events", "auto")
            .style("fill-opacity", function (d) {
                if (curSelectedMapClass == -1) {
                    return '0.7'
                } else {
                    if (d.class == curSelectedMapClass) {
                        return '0.7'
                    } else {
                        return '0.4'
                    }
                }
            })
            .style("stroke", "#D0D6D0")
            .style("stroke-width", function () {
                if (SystemName == 'GDP') {
                    return '1px';
                } else if (SystemName == 'Air') {
                    return '0.15px';
                } else if (SystemName == 'Wenzhou') {
                    return '0.7px';
                }
            })
            .on("click", function (d, i) {
                if (d3.event.ctrlKey) {
                    //paraLines
                    curSelectedMapClass = -1;
                    axisOrder = getMutualInfo(cluster_result, kmeansClusterResult);
                    addMarixView(axisOrder, cluster_result, SystemName);
                    addRadarView(axisOrder, gdpData, undefined, cluster_result);
                    if (showParaFlag) {
                        parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                            sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                    }
                    d3.select(".paraLineG")
                        .selectAll("path").style("opacity", "0.7");

                    //intervalLines
                    d3.select(".intervalLineG")
                        .selectAll("path").style("opacity", "0.7");

                    //voronoi
                    d3.select(".voronoiG")
                        .selectAll("path")
                        .style("fill-opacity", "0.7");

                    /* 
                    var thisClass = d.class;
                    addRadarView(axisOrder, gdpData, thisClass, cluster_result);
                    curSelectedMapClass = thisClass;
                    var paraLines = d3.select(".paraLineG")
                        .selectAll("[name='" + d.name + "']");
                    paraLines.style("opacity", "1")


                    var intervalLines = d3.select(".intervalLineG")
                        .selectAll("[name='" + d.name + "']");
                    intervalLines.style("opacity", "1");
                    //voronoi
                    d3.select(".voronoiG")
                        .selectAll("[name='" + d.name + "']")
                        .style("fill-opacity", "0.7") */

                } else {
                    //paraLines
                    var thisClass = d.class;
                    // cluster_result = [originalClusterResult[thisClass]];
                    axisOrder = getMutualInfo([cluster_result[thisClass]], kmeansClusterResult);
                    addMarixView(axisOrder, cluster_result, SystemName, thisClass);
                    addRadarView(axisOrder, gdpData, thisClass, cluster_result);
                    if (showParaFlag) {
                        parallelCoors(map, kmeansClusterResult, axisOrder, gdpData,
                            sitesData, cluster_result, selection, projection, curSelectedMapClass, SystemName, colorScale, stackFlag);
                    }
                    if (curSelectedMapClass === thisClass) {
                        curSelectedMapClass = -1;
                        d3.select(".paraLineG")
                            .selectAll("path").style("opacity", "0");
                        d3.select(".intervalLineG")
                            .selectAll("path").style("opacity", "0");
                        d3.select(".voronoiG")
                            .selectAll("path")
                            .style("fill-opacity", "0.4");
                    } else {
                        curSelectedMapClass = thisClass;
                        d3.select(".paraLineG")
                            .selectAll("path").style("opacity", "0");
                        var paraLines = d3.select(".paraLineG")
                            .selectAll("[mapClass='" + thisClass + "']");
                        paraLines.style("opacity", "1");
                        //intervalLines
                        d3.select(".intervalLineG")
                            .selectAll("path").style("opacity", "0");
                        var intervalLines = d3.select(".intervalLineG")
                            .selectAll("[mapClass='" + thisClass + "']");
                        intervalLines.style("opacity", "1");
                        //voronoi
                        d3.select(".voronoiG")
                            .selectAll("path")
                            .style("fill-opacity", "0.4");
                        d3.select(".voronoiG")
                            .selectAll("[mapClass='" + thisClass + "']")
                            .style("fill-opacity", "0.7")
                    }
                }
            })
        /*  .on("mouseover", function (d) {
             
             var div = d3.select("#tipDiv")
                 .style("opacity", 1)
                 .style("top", d[1] + "px")
                 .style("left", d[0] + "px")
             if (SystemName === 'Air') {
                 d3.select("#tipDiv")
                     .style("opacity", 1)
                     .style("top", (d[1]-120) + "px")
                     .style("left", (d[0]-100) + "px")
             }
             var a = map.layerPointToContainerPoint([d3.event.layerX, d3.event.layerY])
             
             if (SystemName === 'GDP') {
                 div.style("width", "30px")
             } else if (SystemName === 'Air') {
                 div.style("width", "90px")
             }
             div.selectAll("text").remove();
             div.selectAll("br").remove();

             var text = '';
             var thisClass = d.class;
             for (var i = 0; i < cluster_result.length; i++) {
                 if (cluster_result[i][0].color === thisClass) {
                     div.style("height", 18 * cluster_result[i].length + "px")
                     for (var j = 0; j < cluster_result[i].length; j++) {
                         if (cluster_result[i][j].name.length >= 3 && SystemName === 'GDP') {
                             div.style("width", "40px")
                         }
                         div.append("text")
                             .text((cluster_result[i][j].name + '\n'))
                             .append("br")
                     }
                 }
             }
         })
         .on("mouseout", function (d) {
             d3.select("#tipDiv")
                 .style("opacity", 0)

         }) */


        /*  .on("click mouseout", function (d, i) {
             var thisClass = d.class;
             addRadarView(axisOrder, gdpData, thisClass, cluster_result);
             curSelectedMapClass = thisClass;
             d3.select(".paraLineG")
                 .selectAll("path").style("opacity", "0.05");
            
             //intervalLines
             d3.select(".intervalLineG")
                 .selectAll("path").style("opacity", "0.05");
             
             //voronoi
             d3.select(".voronoiG")
                 .selectAll("path")
                 .style("fill-opacity", "0.4"); 
         }) */


    }
}



load('GDP');
/* d3.select("#loadDataButton").text("GDP Data");
 */

/* d3.select("#loadDataButton").text("Air Data");
d3.select("#loadDataButton").append("span")
    .attr("class", 'caret'); */
$(function () {
    $('#AirData').on('click', function () {
        d3.select(".leaflet-overlay-pane").select("svg").remove();
        load('Air');
        d3.select("#loadDataButton").text("Air Data");
        d3.select("#loadDataButton").append("span")
            .attr("class", 'caret');
    })
    $('#GdpData').on('click', function () {
        d3.select(".leaflet-overlay-pane").select("svg").remove();
        load('GDP');
    })
    $('#BikeData').on('click', function () {
        d3.select(".leaflet-overlay-pane").select("svg").remove();
        d3.select("#loadDataButton").text("Bike Data");
        d3.select("#loadDataButton").append("span")
            .attr("class", 'caret');
        load('Wenzhou');

    })

})