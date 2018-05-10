function getKmeansClusterData(gdpData) {
    var clusterData = [];
    var keys = d3.keys(gdpData[0]);
    keys.splice(0, 1);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        clusterData[i] = [];
        clusterData[i].name = key;
        for (var j = 0; j < gdpData.length; j++) {
            var thisPrv = [parseFloat(gdpData[j][key])];
            thisPrv.name = gdpData[j].Prvcnm;
            clusterData[i].push(thisPrv);
            // clusterData[i][j].prvName=;
        }
    }
    return clusterData;
}

function kmeansCluster(clusterData) {
    var cluster_result = [];
    var kmeans = new KMeans();
    for (var i = 0; i < clusterData.length; i++) {
        cluster_result[i] = [];
        cluster_result[i].name = clusterData[i].name;
        for (var j = 0; j < 31; j++) {
            cluster_result[i][j] = kmeans.cluster(clusterData[i], j);
        }
    }
    return cluster_result;
}