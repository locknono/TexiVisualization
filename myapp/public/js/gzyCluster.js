function gdpCluster(sitesData, data, spaceDisThr, propDisThr) {

    var clusterData = getClusterData(sitesData, data);
    var DmaxList = [];
    for (var i = 0; i < clusterData[0].props.length; i++) {
        var Di_max = d3.max(clusterData, function (d) {
            return d.props[i];
        })
        var Di_min = d3.min(clusterData, function (d) {
            return d.props[i];
        })
        DmaxList.push(Di_max - Di_min);
    }

    var cluster_result = cluster(clusterData, DmaxList, spaceDisThr, propDisThr);
    /*  console.log('cluster_result: ', cluster_result);
     var clusterLengthArray = [];

     for (var i = 0; i < cluster_result.length; i++) {
         clusterLengthArray.push(cluster_result[i].length);
     }
     clusterLengthArray.sort(d3.descending);

     for (var i = 0; i < clusterLengthArray.length; i++) {
         // i use for once
         for (var j = 0; j < cluster_result.length; j++) {
             for (var s = 0; s < cluster_result[j].length; s++) {
                 if (cluster_result[j].length === clusterLengthArray[i]) {
                     cluster_result[j][s].color = i;
                 }
             }
         }

     } */
    /*  console.log('cluster_result: ', cluster_result);
    console.log('clusterLengthArray: ', clusterLengthArray);
 */
    return cluster_result;
}

function getClusterData(sitesData, data) {
    var clusterData = [];
    for (var i = 0; i < data.length; i++) {
        var thisPrv = {};
        thisPrv.color = -1;
        thisPrv.name = data[i].Prvcnm;
        thisPrv.position = [];
        for (var j = 0; j < sitesData.sites.length; j++) {
            if (data[i].Prvcnm == sitesData.sites[j].name) {
                thisPrv.position.push(sitesData.sites[j].lat, sitesData.sites[j].lng)
            }
        }
        thisPrv.props = [];
        for (var j = 1; j < d3.keys(data[i]).length; j++) {
            var key = d3.keys(data[i])[j];
            thisPrv.props.push(parseFloat(data[i][key]));
        }
        clusterData.push(thisPrv);
    }
    return clusterData;
}


var cloneObj = function (obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj),
            newobj = JSON.parse(str);
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};

function cluster(data, DmaxList, spaceDisThr, propDisThr) {
    var attrData = cloneObj(data);

    getSpaceDis = function (p1, p2) {
        return Math.sqrt(Math.pow(p1.position[0] - p2.position[0], 2) +
            Math.pow(p1.position[1] - p2.position[1], 2));
    }
    getPropDis = function (p1, p2) {
        var propCount = 0;
        for (var i = 0; i < p1.props.length; i++) {
            var Aik = p1.props[i];
            var Ajk = p2.props[i];
            var Dkmax = DmaxList[i];
            propCount += (Math.abs(Aik - Ajk) / Dkmax);
        }
        propCount = Math.pow(propCount, 1 / p1.props.length);
        return propCount;
    }

    function allColored(attrData) {
        var allColoredFlag = true;
        for (var i = 0; i < attrData.length; i++) {
            if (attrData[i].color === -1) {
                allColoredFlag = false;
            }
        }
        return allColoredFlag;
    }

    function getUnColoredData(attrData) {
        var unColoredData = [];
        for (var i = 0; i < attrData.length; i++) {
            if (attrData[i].color === -1) {
                unColoredData.push(attrData[i]);
            }
        }
        return unColoredData;
    }

    function getColoredData() {
        var coloredData = [];
        for (var i = 0; i < attrData.length; i++) {
            if (attrData[i].color !== -1) {
                coloredData.push(attrData[i]);
            }
        }
        return coloredData;
    }
    var colorIndex = 0;

    var colorCount = 0;
    while (!allColored(attrData)) {



        colorCount++;
        if (colorCount > 2000) {

            break;
        }
        var unColoredData = getUnColoredData(attrData);
        var Fk = unColoredData[parseInt(Math.random() * (unColoredData.length - 1))];
        var connectedData = [];
        for (var i = unColoredData.length - 1; i >= 0; i--) {
            if (getSpaceDis(Fk, unColoredData[i]) <= spaceDisThr &&
                getPropDis(Fk, unColoredData[i]) <= propDisThr) {
                unColoredData[i].color = colorIndex;
                connectedData.push(unColoredData[i]);

            }
        }
        if (connectedData.length > 1) {
            for (var i = 0; i < connectedData.length; i++) {
                let Fk = connectedData[i];
                let unColoredData = getUnColoredData(attrData);
                for (var j = unColoredData.length - 1; j >= 0; j--) {
                    if (getSpaceDis(Fk, unColoredData[j]) <= spaceDisThr &&
                        getPropDis(Fk, unColoredData[j]) <= propDisThr) {
                        unColoredData[j].color = colorIndex;

                        connectedData.push(unColoredData[j]);
                    }
                }
            }
        }
        colorIndex++;
    }
    var cluster_result = [];
    for (var i = 0; i < colorIndex; i++) {
        var array = [];
        for (var j = 0; j < attrData.length; j++) {
            if (attrData[j].color == i) {
                array.push(attrData[j]);
            }
        }
        cluster_result.push(array);
    }
    return cluster_result;
}

function changeClusterColor(selection, cluster_result) {
    selection.selectAll(".voronoiPath")
        .style("fill", function (d, i) {
            for (var j = 0; j < cluster_result.length; j++) {
                for (var s = 0; s < cluster_result[j].length; s++) {
                    if (cluster_result[j][s].name == d.name) {
                        return colorScale(cluster_result[j][s].color);
                    }
                }
            }
        })
}