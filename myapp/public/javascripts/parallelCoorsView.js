function parallelCoors(map, meansClusterResult, axisOrder,
    gdpData, sitesData, cluster_result, selection, projection, curSelectedMapClass, systemName, colorScale, stackFlag) {
    if (systemName == 'GDP') {
        var thinLineWidth = 4;
        var thickLineWidth = 8;
        var nodeR = 3;
        var margin = {
            top: 130,
            left: 10,
            right: 20,
            bottom: 200
        };
        var axisTextSize = 13;
        var leftStart = 110;
        var rightStart = 1030;
        var leftPad = 120;
        var rightPad = 120;
    } else if (systemName == 'Air') {
        var axisTextSize = 4;
        var thinLineWidth = 0.4;
        var thickLineWidth = 0.8;
        var nodeR = 0.5;
        var margin = {
            top: 389,
            left: 10,
            right: 20,
            bottom: 360
        };
        var leftStart = 675;
        var rightStart = 749.5;
        var leftPad = 20;
        var rightPad = 20;
    } else if (systemName == 'Wenzhou') {
        var axisTextSize = 4;
        var thinLineWidth = 2;
        var thickLineWidth = 4;
        var nodeR = 0.5;
        var margin = {
            top: 100,
            left: 10,
            right: 20,
            bottom: 100
        };
        var leftStart = 210;
        var rightStart = 935;
        var leftPad = 100;
        var rightPad = 100;
    }

    getLineColor();

    selection.selectAll(".axisTextG").remove();
    selection.selectAll(".paraLineG").remove();
    selection.selectAll(".axisG").remove();
    selection.selectAll(".intervalLineG").remove();
    selection.selectAll(".prvDot").remove();
    var mapContainerSize = map.getSize();
    var mapContainerWidth = mapContainerSize.x;
    var mapContainerHeight = mapContainerSize.y;


    var leftXArray = [];
    var rightXArray = [];
    var paraLineG = selection.append("g")
        .attr("class", "paraLineG");
    var intervalLineG = selection.append("g")
        .attr("class", "intervalLineG");
    var prvDot = selection.append("g")
        .attr("class", "prvDot");
    for (var i = 0; i < axisOrder.length; i++) {
        if (axisOrder[i] === undefined) {
            axisOrder[i] = {};
        }
    }
    for (var i = 0; i < axisOrder.length; i++) {
        for (var j = 0; j < axisOrder[i].length; j++) {
            if (i == 0) {
                trasnlateX = leftStart - leftPad * j;
                leftXArray.push(trasnlateX);
            } else {
                trasnlateX = rightStart + rightPad * j;
                rightXArray.push(trasnlateX);
            }

            var axisTextG = selection.append("g")
                .attr("class", "axisTextG")
                .attr("transform", "translate(" + trasnlateX + ")");
            var axisY = 150;
            if (systemName == 'Air') {
                axisY = 395;
            } else if (systemName == 'Wenzhou') {
                axisY = 120;
            }
            axisTextG.append("text")
                .text(function (d) {
                    if (axisOrder[i][j] === undefined) {
                        return;
                    }
                    return axisOrder[i][j].name;

                })
                .style("font-size", axisTextSize)
                .style("text-anchor", "start")
                .attr("transform", "translate(" + 1 + "," + axisY + ")" + "rotate(-90)")
                .attr("dx", "2em");
        }

    }
    addParaLine("left");
    addParaLine("right");

    function addParaLine(direction) {
        var leftLine = [];
        if (direction === "left") {
            var axis = axisOrder[0];
            /*for (var i = axis.length - 1; i >= 1; i--) {
                axis.splice(i, 1);
            }*/
            var xArray = leftXArray;
        } else {
            var axis = axisOrder[1];
            /*  for (var i = axis.length - 1; i >= 1; i--) {
                  axis.splice(i, 1);
              }
              */
            var xArray = rightXArray;
        }


        for (var i = 0; i < axis.length; i++) {
            if (axis[i] === undefined) {
                continue;
            }

            var axisPoint = [];
            var name = axis[i].name;
            var maxGdp = d3.max(gdpData, function (d) {
                return parseFloat(d[name]);
            })
            var minGdp = d3.min(gdpData, function (d) {
                return parseFloat(d[name]);
            })
            var thisAxisScale = d3.scaleLinear()
                .domain([minGdp, maxGdp])
                .range([(mapContainerHeight - margin.bottom), margin.top])
            //add axis
            var axisG = selection.append("g")
                .attr("class", "axisG")
                .attr("transform", "translate(" + xArray[i] + ")");
            var thisAxis = d3.axisLeft(thisAxisScale)
                .tickValues([minGdp, maxGdp]);
            if (systemName == 'Air') {
                thisAxis.tickSize(0.6);
            } else if (systemName == 'Wenzhou') {

            }
            axisG.append("g").call(thisAxis);

            if (systemName == 'GDP') {
                selection.selectAll("text").style("font-size", "25px")
                    .style("stroke-weight", "bold")

            }

            if (systemName == 'Air') {
                selection.selectAll(".domain").style("stroke-width", "0.1px")
                selection.selectAll("line").style("stroke-width", "0.1px")
                selection.selectAll("text").style("font-size", "3px")

                selection.selectAll(".axisG").selectAll("text").attr("x", "-1.5")
            } else if (systemName == 'Wenzhou') {
                selection.selectAll("text").style("font-size", "12px")
            }

            /*   if (stackFlag === false) {
                  for (var j = 0; j < axis[i].parallelCluster.length; j++) {
                      for (var k = 0; k < axis[i].parallelCluster[j].length; k++) {
                          var point = [];
                          let pointY = thisAxisScale(axis[i].parallelCluster[j][0]);
                          let pointX = xArray[i];
                          point = [pointX, pointY];
                          point.name = axis[i].parallelCluster[j][k].name;
                          axisPoint.push([pointX, pointY])
                      }
                  }
                  leftLine.push(axisPoint);
                  
              } else if (stackFlag === true) { */
            // j ---  one axis each cluster
            var thisAxisPoint = [];
            var thisAxisClassMinY = [];

            for (var j = 0; j < axis[i].parallelCluster.length; j++) {
                var thisKmeansClass = axis[i].parallelCluster[j];
                var thisKmeansClassPoint = [];
                //s --- inside a cluster
                for (var s = 0; s < thisKmeansClass.length; s++) {
                    var prv = thisKmeansClass[s];
                    var name = prv.name;
                    for (var m = 0; m < gdpData.length; m++) {
                        if (name == gdpData[m].Prvcnm) {
                            var y = thisAxisScale(gdpData[m][axis[i].name]);
                            var thisPoint = [xArray[i], y];
                            thisPoint.name = gdpData[m].Prvcnm;
                            thisKmeansClassPoint.push(thisPoint);
                        }
                    }
                }
                var maxY = d3.max(thisKmeansClassPoint, function (d) {
                    return d[1];
                })
                var minY = d3.min(thisKmeansClassPoint, function (d) {
                    return d[1];
                })
                thisAxisClassMinY.push(minY);
            }
            for (var j = 0; j < axis[i].parallelCluster.length; j++) {
                var thisKmeansClass = axis[i].parallelCluster[j];
                var thisKmeansClassPoint = [];
                //s --- inside a cluster
                for (var s = 0; s < thisKmeansClass.length; s++) {
                    var prv = thisKmeansClass[s];
                    var name = prv.name;
                    for (var m = 0; m < gdpData.length; m++) {
                        if (name == gdpData[m].Prvcnm) {
                            var y = thisAxisScale(gdpData[m][axis[i].name]);
                            var thisPoint = [xArray[i], y];
                            thisPoint.name = gdpData[m].Prvcnm;
                            thisKmeansClassPoint.push(thisPoint);
                        }
                    }
                }
                var maxY = d3.max(thisKmeansClassPoint, function (d) {
                    return d[1];
                })
                var minY = d3.min(thisKmeansClassPoint, function (d) {
                    return d[1];
                })
                var thisAxisClassMinY2 = cloneObj(thisAxisClassMinY.sort());

                var rankIndex = thisAxisClassMinY2.indexOf(minY);




                var pad = (mapContainerHeight - margin.bottom - margin.top) / (2 * axis[i].parallelCluster.length - 1);

                var scale = d3.scaleLinear()
                    .domain([minY, maxY])
                    .range([margin.top + rankIndex * 2 * pad + 0.3 * pad, margin.top + rankIndex * 2 * pad]);

                if (rankIndex == thisAxisClassMinY2.length - 1) {
                    var scale = d3.scaleLinear()
                        .domain([minY, maxY])
                        .range([margin.top + rankIndex * 2 * pad + pad, margin.top + rankIndex * 2 * pad + 0.7 * pad]);
                }
                if (stackFlag === true) {
                    for (var q = 0; q < thisKmeansClassPoint.length; q++) {
                        thisKmeansClassPoint[q][1] = scale(thisKmeansClassPoint[q][1]);
                    }
                }

                thisAxisPoint.push(thisKmeansClassPoint);
            }
            for (var z = 0; z < gdpData.length; z++) {
                for (var x = 0; x < thisAxisPoint.length; x++) {
                    for (var c = 0; c < thisAxisPoint[x].length; c++) {
                        if (thisAxisPoint[x][c].name == gdpData[z].Prvcnm) {
                            axisPoint.push(thisAxisPoint[x][c]);
                        }
                    }
                }
            }
            leftLine.push(axisPoint);


        }

        var colorIndex = d3.max(sitesData.sites, function (d) {
            return d.color;
        })

        var leftLineArray = leftLine[0].map(function (col, i) {
            return leftLine.map(function (row) {
                return row[i];
            })
        });

        for (var i = 0; i < leftLineArray.length; i++) {
            leftLineArray[i].name = leftLineArray[i][0].name;
        }

        var clusterLine = getClusterLine();

        var interiorAxis = getInteriorAxis(clusterLine);


        var firstControlPointArray = getFirstControlPoint();
        var secondControlPointArray = getSecondControlPoint();

        var intervalLines = [];

        for (var i = 0; i < clusterLine.length; i++) {
            intervalLines[i] = [];
            for (var j = 0; j < clusterLine[i].length; j++) {
                intervalLines[i][j] = [];
                intervalLines[i][j].push(clusterLine[i][j][0]);
            }
        }



        for (var i = 0; i < intervalLines.length; i++) {
            for (var j = 0; j < intervalLines[i].length; j++) {
                var point = firstControlPointArray[i];
                var secondPoint = secondControlPointArray[i];

                var midPointX = (point[0] + secondPoint[0]) / 2;

                var midPointY = (point[1] + secondPoint[1]) / 2;
                var k = (secondPoint[1] - point[1]) / (secondPoint[0] - point[0]);

                intervalLines[i][j].push(point);

                if (systemName == 'GDP') {
                    if (k >= 0) {
                        intervalLines[i][j].push([midPointX, midPointY + 110]);
                    } else {
                        //from left-bottom to right-top
                        intervalLines[i][j].push([midPointX - 30, midPointY + 60]);
                    }
                } else if (systemName == 'Air') {
                    if (k >= 0) {
                        intervalLines[i][j].push([midPointX, midPointY + 8]);
                    } else {
                        //from left-bottom to right-top
                        intervalLines[i][j].push([midPointX - 3, midPointY + 6]);
                    }
                } else if (systemName == 'Wenzhou') {
                    if (k >= 0) {
                        intervalLines[i][j].push([midPointX, midPointY + 8]);
                    } else {
                        //from left-bottom to right-top
                        intervalLines[i][j].push([midPointX - 3, midPointY + 6]);
                    }
                }
                // intervalLines[i][j].push([secondPoint[0], point[1]])
                intervalLines[i][j].push(secondPoint);
            }
        }



        drawParaLine();
        drawIntervalLine();
        //for each cluster ,calculate the first control point 
        //x for (max-min)/2
        function getFirstControlPoint() {
            var xValueArray = [];
            var avgArray = [];
            for (var i = 0; i < interiorAxis.length; i++) {
                var thisCluster = interiorAxis[i];
                var maxGdp = d3.max(thisCluster, function (d, i) {
                    return d[1];
                })
                var minGdp = d3.min(thisCluster, function (d, i) {
                    return d[1];
                })
                var avgGdp = d3.mean(thisCluster, function (d, i) {
                    return d[1];
                });
                var xValue = (maxGdp - minGdp) / 2;
                xValueArray.push(xValue);
                avgArray.push(avgGdp);
            }
            var maxXValue = d3.max(xValueArray);
            var minXValue = d3.min(xValueArray);
            if (systemName == 'GDP') {
                if (direction === 'left') {
                    var xScale = d3.scaleLinear()
                        .domain([minXValue, maxXValue])
                        .range([leftStart + 30, leftStart + 100])
                } else {
                    var xScale = d3.scaleLinear()
                        .domain([minXValue, maxXValue])
                        .range([rightStart - 30, rightStart - 180])
                }
            } else if (systemName == 'Air') {
                if (direction === 'left') {
                    var xScale = d3.scaleLinear()
                        .domain([minXValue, maxXValue])
                        .range([leftStart + 3, leftStart + 18])
                } else {
                    var xScale = d3.scaleLinear()
                        .domain([minXValue, maxXValue])
                        .range([rightStart - 3, rightStart - 18])
                }
            } else if (systemName == 'Wenzhou') {
                if (direction === 'left') {
                    var xScale = d3.scaleLinear()
                        .domain([minXValue, maxXValue])
                        .range([leftStart + 5, leftStart + 180])
                } else {
                    var xScale = d3.scaleLinear()
                        .domain([minXValue, maxXValue])
                        .range([rightStart - 5, rightStart - 180])
                }
            }
            var interval = (mapContainerHeight - margin.bottom - margin.top) / (interiorAxis.length);
            var minAvgGdp = d3.min(avgArray);
            var maxAvgGdp = d3.max(avgArray);
            var yScale = d3.scaleLinear()
                .domain([maxAvgGdp, minAvgGdp])
                .range([mapContainerHeight - margin.bottom, margin.top]);
            /*var yScale = d3.scaleOrdinal()
                .domain(avgArray.sort().reverse())
                .range(d3.range(mapContainerHeight - margin.bottom - interval / 2, margin.top - interval / 2, -interval));
            */
            var firstControlPointArray = [];
            for (var i = 0; i < interiorAxis.length; i++) {
                var thisCluster = interiorAxis[i];
                var maxGdp = d3.max(thisCluster, function (d, i) {
                    return d[1];
                })
                var minGdp = d3.min(thisCluster, function (d, i) {
                    return d[1];
                })
                var y = d3.mean(thisCluster, function (d) {
                    return d[1];

                })
                var avgGdp = d3.mean(thisCluster, function (d, i) {
                    return d[1];
                });
                var xValue = (maxGdp - minGdp) / 2;
                var x = xScale(xValue);
                //  var y = yScale(avgGdp);
                var controlPoint = [x, y];
                firstControlPointArray.push(controlPoint);
            }

            return firstControlPointArray;
        }

        function getSecondControlPoint() {
            var secondControlPointArray = [];

            for (var i = 0; i < cluster_result.length; i++) {

                var thisClass = cluster_result[i];

                var maxDis = getMaxDisInOneCluster(thisClass);
                var midPointX = (maxDis.point1.x + maxDis.point2.x) / 2;
                var midPointY = (maxDis.point1.y + maxDis.point2.y) / 2;
                /* selection.append("line")
                .attr("x1",maxDis.point1.x)
                .attr("y1",maxDis.point1.y)
                .attr("x2",maxDis.point2.x)
                .attr("y2",maxDis.point2.y)
                .attr("stroke","black")
                /*  selection.append("line")
                .attr("x1",x1)
                .attr("y1",y1)
                .attr("x2",x2)
                .attr("y2",y2)
                .attr("stroke","black")
            */
                if (maxDis.point1.x - maxDis.point2.x != 0) {
                    var k = (maxDis.point1.y - maxDis.point2.y) / (maxDis.point1.x - maxDis.point2.x);
                    var d = maxDis.dis;
                    var x1 = midPointX;
                    var y1 = midPointY;

                    var b = y1 - k * x1;
                    var a = Math.pow(k, 2) + 2 + 1 / Math.pow(k, 2);
                    var b1 = -2 * x1 - 2 * k * y1 + 2 * k * b + (2 * b) / k - (2 * x1) / (k * k) - 2 * y1 / k;
                    var c = Math.pow(x1, 2) / Math.pow(k, 2) - (2 * b * x1) / k -
                        2 * b * y1 - Math.pow(k, 2) * Math.pow(d, 2) + Math.pow(d, 2) - Math.pow(b, 2) +
                        y1 * y1 + 2 * x1 * y1 / k;

                    if (direction == 'right') {
                        var x = (-b1 + Math.sqrt(b1 * b1 - 4 * a * c)) / (2 * a);
                        var y = (x1 - x) / k + y1;
                    } else {
                        var x = (-b1 - Math.sqrt(b1 * b1 - 4 * a * c)) / (2 * a);
                        var y = (x1 - x) / k + y1;
                    }
                    var dis1 = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
                    var dis2 = maxDis.dis * 0.6;


                    var lamda = dis1 / dis2;
                    x = (x + lamda * x1) / (1 + lamda);
                    y = (y + lamda * y1) / (1 + lamda);

                    var xc = ((1 + 0.5) * x) - (0.5 * x1);
                    var yc = ((1 + 0.5) * y) - (0.5 * y1);

                    var control_point = [xc, yc];
                    var controlPoint = [x, y];
                    if (systemName === 'Air' && thisClass[0].name === '衢州环保大楼') {
                        var xc = ((1 + 30) * x) - (30 * x1);
                        var yc = ((1 + 30) * y) - (30 * y1);
                        var control_point = [xc, yc];
                    }
                    controlPoint.control = control_point;
                    secondControlPointArray.push(controlPoint);

                    /*  selection.append("circle")
                         .attr("r", 5)
                         .attr("cx", xc)
                         .attr("cy", yc)
                         .attr("fill", "red"); */
                } else {
                    if (systemName == 'GDP') {
                        if (direction == 'right') {
                            var x = maxDis.point1.x + 50;
                            var y = maxDis.point1.y;
                        } else {

                            var x = maxDis.point1.x - 50;
                            var y = maxDis.point1.y;
                        }
                    } else if (systemName == 'Air') {
                        if (direction == 'right') {
                            var x = maxDis.point1.x + 2;
                            var y = maxDis.point1.y;
                        } else {
                            var x = maxDis.point1.x - 2;
                            var y = maxDis.point1.y;
                        }
                    } else if (systemName == 'Wenzhou') {
                        if (direction == 'right') {
                            var x = maxDis.point1.x + 2;
                            var y = maxDis.point1.y;
                        } else {
                            var x = maxDis.point1.x - 2;
                            var y = maxDis.point1.y;
                        }
                    }
                    var controlPoint = [x, y];
                    let control_point = [x, y];
                    controlPoint.control2 = control_point;
                    secondControlPointArray.push(controlPoint);
                }

            }

            return secondControlPointArray;
        }

        function getMaxDisInOneCluster(thisClass) {
            function getDis(p1, p2) {
                return Math.sqrt(Math.pow(p1.x - p2.x, 2) +
                    Math.pow(p1.y - p2.y, 2));
            }
            var disArray = [];
            for (var i = 0; i < thisClass.length; i++) {
                for (var j = 0; j < thisClass.length; j++) {
                    var dis = {
                        point1: projection.latLngToLayerPoint(thisClass[i].position),
                        point2: projection.latLngToLayerPoint(thisClass[j].position),
                        dis: getDis(projection.latLngToLayerPoint(thisClass[i].position),
                            projection.latLngToLayerPoint(thisClass[j].position))
                    }
                    disArray.push(dis);
                }
            }
            var maxDis = d3.max(disArray, function (d) {
                return d.dis;
            });

            for (var i = 0; i < thisClass.length; i++) {
                for (var j = 0; j < thisClass.length; j++) {
                    var dis = {
                        point1: projection.latLngToLayerPoint(thisClass[i].position),
                        point2: projection.latLngToLayerPoint(thisClass[j].position),
                        dis: getDis(projection.latLngToLayerPoint(thisClass[i].position),
                            projection.latLngToLayerPoint(thisClass[j].position))
                    }
                    if (getDis(projection.latLngToLayerPoint(thisClass[i].position),
                            projection.latLngToLayerPoint(thisClass[j].position)) == maxDis) {
                        return dis;
                    }
                }
            }

        }

        function getClusterLine() {
            var clusterLine = [];
            var colorIndex = d3.max(sitesData.sites, function (d) {
                return d.color;
            })

            for (var i = 0; i < colorIndex + 1; i++) {
                var array = [];
                for (var j = 0; j < sitesData.sites.length; j++) {
                    if (sitesData.sites[j].color == i) {
                        array.push(sitesData.sites[j]);
                    }
                }
                clusterLine.push(array);
            }
            for (var i = 0; i < leftLineArray.length; i++) {
                for (var j = 0; j < sitesData.sites.length; j++) {
                    if (leftLineArray[i].name == sitesData.sites[j].name) {
                        leftLineArray[i].class = sitesData.sites[j].color;
                    }
                }
            }
            for (var i = 0; i < clusterLine.length; i++) {
                for (var j = 0; j < clusterLine[i].length; j++) {
                    for (var s = 0; s < leftLineArray.length; s++) {
                        if (clusterLine[i][j].name == leftLineArray[s].name) {
                            clusterLine[i][j] = leftLineArray[s];
                        }
                    }
                }
            }
            return clusterLine;
        }

        function drawParaLine() {
            var line = d3.line()
                .x(function (d, i) {
                    return d[0];
                })
                .y(function (d, i) {
                    return d[1];
                })
                .curve(d3.curveCardinal.tension(0.3));
            // .curve(d3.curveBundle.beta(0.9));
            
            for (var s = 0; s < cluster_result.length; s++) {

                for (var m = 0; m < cluster_result[s].length; m++) {
                    if (clusterLine[s][m].name === cluster_result[s][m].name) {
                        clusterLine[s][m].class = cluster_result[s][m].color;
                    }
                }
            }
            
            for (var i = 0; i < clusterLine.length; i++) {

                var thisClass = clusterLine[i];
                for (var j = 0; j < thisClass.length; j++) {
                    var thisPrv = thisClass[j];
                    
                    var controlPointArray = [];
                    for (var s = 0; s <= thisPrv.length - 2; s++) {
                        var m = s + 1;
                        if (thisPrv[m] === undefined) {
                            thisPrv[m] = thisPrv[s];
                        }
                        var maxY = d3.max([thisPrv[s][1], thisPrv[m][1]]);
                        var minY = d3.min([thisPrv[s][1], thisPrv[m][1]]);
                        var x = (thisPrv[s][0] + thisPrv[m][0]) / 2;
                        var height = maxY - minY;
                        var y1 = minY;
                        var y2 = maxY;
                        if (thisPrv[s][1] <= thisPrv[m][1]) {
                            controlPointArray.push([x, y1]);
                            controlPointArray.push([x, y2]);
                        } else {
                            controlPointArray.push([x, y2]);
                            controlPointArray.push([x, y1]);
                        }
                    }


                    var pathPointArray = [];


                    for (var q = 0; q < thisPrv.length; q++) {
                        pathPointArray.push(thisPrv[q]);
                        if (q !== thisPrv.length - 1) {
                            pathPointArray.push(controlPointArray[q * 2]);
                            pathPointArray.push(controlPointArray[(q * 2 + 1)]);
                        }
                    }

                    var path = d3.path();

                    for (var g = 0; g < pathPointArray.length; g++) {
                        if (g == 0) {
                            path.moveTo(pathPointArray[0][0], pathPointArray[0][1]);
                        } else if (g != 0 && g % 3 == 0) {
                            path.bezierCurveTo(pathPointArray[g - 2][0], pathPointArray[g - 2][1],
                                pathPointArray[g - 1][0], pathPointArray[g - 1][1],
                                pathPointArray[g][0], pathPointArray[g][1]);
                        }
                    }


                    // 
                    paraLineG.append("path")
                        .attr("d", path)
                        .attr("name", clusterLine[i][j].name)
                        .attr("mapClass", function () {
                            return clusterLine[i][j].class;
                        })
                        .style("stroke-width", function () {
                            return thinLineWidth;
                        })
                        .style("stroke", colorScale(getThisLineColor(clusterLine[i][j])))
                        .style("fill", "none")
                        .style("pointer-events", "auto")
                        .style("opacity", function (d) {
                            if (curSelectedMapClass == -1) {
                                return '0.7'
                            } else {
                                if (clusterLine[i][j].class == curSelectedMapClass) {
                                    return '1'
                                } else {
                                    return '0';
                                }
                            }
                        });
                    /*  */
                }
            }
            for (var i = 0; i < clusterLine.length; i++) {
                for (var j = 0; j < clusterLine[i].length; j++) {
                    /* paraLineG.append("path")
                        .attr("d", line(clusterLine[i][j]))
                        .attr("name", clusterLine[i][j].name)
                        .attr("mapClass", clusterLine[i][j].class)
                        .style("stroke-width", function () {
                            return thinLineWidth;
                        })

                        .style("stroke", colorScale(getThisLineColor(clusterLine[i][j])))
                        .style("fill", "none")
                        .style("pointer-events", "auto")
                        .style("opacity", function (d) {
                            if (curSelectedMapClass == -1) {
                                return '0.7'
                            } else {
                                if (clusterLine[i][j].class == curSelectedMapClass) {
                                    return '1'
                                } else {
                                    return '0.1';
                                }
                            }
                        }); */

                }
            }
        }


        function drawIntervalLine() {
            var line = d3.line()
                .x(function (d, i) {
                    return d[0];
                })
                .y(function (d, i) {
                    return d[1];
                })
                .curve(d3.curveBundle.beta(0.9));
            // .curve(d3.curveCardinal.tension(0.1));

            for (var s = 0; s < cluster_result.length; s++) {
                for (var m = 0; m < cluster_result[s].length; m++) {
                    if (intervalLines[s][m][0].name == cluster_result[s][m].name) {
                        intervalLines[s][m][0].class = cluster_result[s][m].color;
                    }
                }
            }


            for (var s = 0; s < cluster_result.length; s++) {
                for (var m = 0; m < cluster_result[s].length; m++) {
                    intervalLinesLoop: for (var l = 0; l < intervalLines.length; l++) {
                        for (var b = 0; b < intervalLines[l].length; b++) {
                            if (intervalLines[l][b][0].name == cluster_result[s][m].name) {
                                intervalLines[l][b][0].class = cluster_result[s][m].color;
                                break intervalLinesLoop;
                            }
                        }
                    }
                }
            }
            // drawBundleLines(intervalLines, intervalLineG);
            /* for (var i = 0; i < intervalLines.length; i++) {
                for (var j = 0; j < intervalLines[i].length; j++) {
                    intervalLines[i][j].splice(0, 1);
                }
            }
            */
            var intervalEndLines = [];
            var oneClassNameArray = [];

            for (var i = 0; i < intervalLines.length; i++) {

                var thisClass = intervalLines[i];

                var mid = thisClass.length / 2;
                var intervalEndLine = [];
                var avgPointYOnAxis = d3.mean(thisClass, function (d, i) {
                    return d[0][1];
                })


                for (var j = 0; j < thisClass.length; j++) {
                    if (systemName == 'GDP') {
                        var pad = 0.3;
                    } else if (systemName == 'Air') {
                        var pad = 0.005;
                    } else if (systemName == 'Wenzhou') {
                        var pad = 0.002;
                    }
                    //firstControlPoint
                    thisClass[j][1][1] = thisClass[j][1][1] - 3 * pad * (mid - j);

                    //secondControlPoint
                    if (thisClass[j][3][1].control !== undefined) {
                        thisClass[j][3][1].control[1] = thisClass[j][3][1].control[1] - 3 * pad * (mid - j)
                    }
                    //between firstControlPoint and secondControlPoint
                    var firstControlPoint = thisClass[j][1];
                    var secondControlPoint = thisClass[j][3];


                    if (direction === 'left') {

                        var controlPoint1X = firstControlPoint[0] + (firstControlPoint[0] - leftStart) * 0.5;
                        if (((firstControlPoint[0] - leftStart) < 10) && systemName === 'Air') {
                            var controlPoint1X = firstControlPoint[0] + 20 * 0.5;
                        }
                        var controlPoint1Y = firstControlPoint[1] - 3 * pad * (mid - j);
                        var controlPoint1 = [controlPoint1X, controlPoint1Y];
                    } else if (direction === 'right') {
                        var controlPoint1X = firstControlPoint[0] - (rightStart - firstControlPoint[0]) * 0.5;
                        if (((rightStart - firstControlPoint[0]) < 10) && systemName === 'Air') {
                            var controlPoint1X = firstControlPoint[0] - 30 * 0.5;
                        }
                        var controlPoint1Y = firstControlPoint[1] - 3 * pad * (mid - j);
                        var controlPoint1 = [controlPoint1X, controlPoint1Y];
                    }


                    var x = (firstControlPoint[0] + secondControlPoint[0]) / 2;
                    var y1 = d3.min([firstControlPoint[1], secondControlPoint[1]]);
                    var y2 = d3.max([firstControlPoint[1], secondControlPoint[1]]);
                    if (secondControlPoint.control !== undefined) {
                        var controlPoint2 = secondControlPoint.control;
                    } else {
                        if (firstControlPoint[1] <= secondControlPoint[1]) {
                            var controlPoint2 = [x, y2];
                        } else {
                            var controlPoint2 = [x, y1];
                        }
                    }
                    //between pointOnAxis and firstControlPoint
                    var originalPoint = thisClass[j][0];
                    var x = (firstControlPoint[0] + originalPoint[0]) / 2;
                    var y1 = d3.min([firstControlPoint[1], originalPoint[1]]);
                    var y2 = d3.max([firstControlPoint[1], originalPoint[1]]);

                    if (originalPoint[1] <= firstControlPoint[1]) {
                        var controlPoint3 = [x, y1];
                        var controlPoint4 = [x, y2];
                    } else {
                        var controlPoint3 = [x, y2];
                        var controlPoint4 = [x, y1];
                    }

                    var intervalCurve = [];
                    intervalCurve.push(thisClass[j][0]); //point on axis
                    intervalCurve.push(controlPoint3);
                    intervalCurve.push(controlPoint4);
                    // intervalCurve.push(avgPointYOnAxis);
                    intervalCurve.push(firstControlPoint);
                    intervalCurve.push(controlPoint1); //curve first control point
                    intervalCurve.push(controlPoint2); //curve second control point
                    intervalCurve.push(secondControlPoint);
                    var path = d3.path();

                    for (var g = 0; g < intervalCurve.length; g++) {
                        if (g == 0) {
                            path.moveTo(intervalCurve[0][0], intervalCurve[0][1]);
                        } else if (g != 0 && g % 3 == 0) {
                            path.bezierCurveTo(intervalCurve[g - 2][0], intervalCurve[g - 2][1],
                                intervalCurve[g - 1][0], intervalCurve[g - 1][1],
                                intervalCurve[g][0], intervalCurve[g][1]);
                        }
                    }
                    intervalEndLine.push([thisClass[j][3][0], thisClass[j][3][1]]);

                    intervalLineG.append("path")
                        //  .attr("d", line(intervalLines[i][j]))
                        .attr("d", path)
                        .attr("name", intervalLines[i][j][0].name)
                        .attr("mapClass", function () {
                            return intervalLines[i][j][0].class;
                        })
                        .style("stroke", colorScale(getThisLineColor(clusterLine[i][j])))
                        .style("stroke-width", function () {
                            if (secondControlPoint.control === undefined) {
                                oneClassNameArray.push(intervalLines[i][j][0].name);
                            }
                            return thickLineWidth;
                        })
                        .style("stroke-linecap", "round")
                        .style("fill", "none")
                        .style("opacity", function (d) {
                            if (curSelectedMapClass == -1) {
                                return '0.7'
                            } else {
                                if (intervalLines[i][j][0].class == curSelectedMapClass) {
                                    return '1'
                                } else {
                                    return '0';
                                }
                            }
                        })
                }
                intervalEndLines.push(intervalEndLine);
            }
            drawLinkLine(intervalEndLines, oneClassNameArray);
        }



        function drawLinkLine(intervalEndLines, oneClassNameArray) {


            for (var i = 0; i < intervalEndLines.length; i++) {
                var thisClass = intervalEndLines[i];
                var node_data = {};
                var edge_data = [];
                var mid = thisClass.length / 2;
                for (var j = 0; j < thisClass.length; j++) {
                    var node = {};
                    node.x = thisClass[j][0];
                    node.y = thisClass[j][1];
                    if (systemName === 'GDP') {
                        node.y = node.y + (mid - j) * 0.3;
                    } else if (systemName === 'Air') {
                        node.y = node.y + (mid - j) * 0.03;
                    }
                    node_data[j] = node;
                    var edge = {};
                    edge.source = j;
                    edge.target = j + thisClass.length;
                    edge_data.push(edge);
                }
                for (var j = 0; j < cluster_result[i].length; j++) {
                    var node = {};
                    node.x = projection.latLngToLayerPoint(cluster_result[i][j].position).x;
                    node.y = projection.latLngToLayerPoint(cluster_result[i][j].position).y;
                    node_data[j + thisClass.length] = node;
                }
                for (var s in node_data) {
                    if (parseFloat(s) > cluster_result[i].length - 1)
                        prvDot.append("circle")
                        .attr("cx", node_data[s].x)
                        .attr("cy", node_data[s].y)
                        .attr("r", nodeR)
                        .style("stroke-width", function () {
                            if (systemName == 'Air') {
                                return '0.1px'
                            }
                            if (systemName == 'Wenzhou') {
                                return '0.1px'
                            }
                        })
                        .style("stroke-linecap", "round")
                        .style("stroke", "black")
                        .style("stroke-opacity", "0.1")
                        .style("fill", colorScale(i));
                }
                var fbundling = d3.ForceEdgeBundling()
                    .step_size(0.1)
                    .compatibility_threshold(0.1)
                    .nodes(node_data)
                    .edges(edge_data);
                var results = fbundling();
                var d3line = d3.line()
                    .x(function (d, i) {
                        return d.x;
                    })
                    .y(function (d, i) {
                        return d.y;
                    })
                    .curve(d3.curveCardinal.tension(0.1));

                for (var s = 0; s < results.length; s++) {
                    intervalLineG.append("path")
                        .attr("d", d3line(results[s]))
                        .style("fill", "none")
                        .style("stroke-linecap", "round")
                        .style("stroke", colorScale(i))
                        .style("stroke-width", function () {
                            if (oneClassNameArray.indexOf(cluster_result[i][s].name) != -1) {
                                return thickLineWidth;
                            }
                            return thinLineWidth;
                        })
                        .style("opacity", function (d) {
                            if (curSelectedMapClass == -1) {
                                return '0.7'
                            } else {
                                if (i == curSelectedMapClass) {
                                    return '1'
                                } else {
                                    return '0';
                                }
                            }
                        })
                        .attr("mapClass", i)
                        .attr("name", cluster_result[i][s].name)
                }
            }
        }
    }

    function getLineColor() {
        for (var i = 0; i < sitesData.sites.length; i++) {
            for (var j = 0; j < cluster_result.length; j++) {
                for (var s = 0; s < cluster_result[j].length; s++) {
                    if (sitesData.sites[i].name == cluster_result[j][s].name) {
                        sitesData.sites[i].color = cluster_result[j][s].color;
                    }
                }
            }
        }
    }

    function getThisLineColor(thisLine) {
        for (var s = 0; s < sitesData.sites.length; s++) {
            if (thisLine.name == sitesData.sites[s].name) {
                return sitesData.sites[s].color;
            }
        }
    }

    function getInteriorAxis(clusterLine) {
        var axis = [];
        for (var i = 0; i < clusterLine.length; i++) {
            var cluster = [];
            for (var j = 0; j < clusterLine[i].length; j++) {
                cluster.push(clusterLine[i][j][0]);
            }
            axis.push(cluster);
        }
        return axis;
    }
}