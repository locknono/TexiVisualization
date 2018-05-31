var options = (function () {
    var clusterNumber = d3.select("#container-main").attr("clusterNumber");
    var status=d3.select("#container-main").attr("status");
    var rootPath = 'data/drawData/' + clusterNumber.toString()+'/'+status+'/';
    var areaScale = d3.scaleOrdinal().domain([])
        .range(['#B8DDEF', '#1f78b4', '#b2df8a','#ffff33','#999999', '#33a02c', '#fb9a99', '#e31a1c', '#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00',,'#a65628','#f781bf',])
    var classScale = d3.scale.category20();
    return {
        rootPath: rootPath,
        clusterNumber: clusterNumber,
        status:status,
        normal_opacity: 0.4,
        mouseover_opacity: 0.75,
        suspending_outer_color: "#D6BD3E",
        suspending_inner_color: "#CEDDE8",
        pieview_colorscale: d3.interpolateYlGnBu,
        areaScale: areaScale,
        classScale: classScale,
        forceLineColor: '#00D3FF',
        odLineOpacity: 0.5,
        odLineColor: '0x00D3FF',
    }
}())