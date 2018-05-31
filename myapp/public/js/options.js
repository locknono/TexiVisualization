var options = (function () {
    var clusterNumber = d3.select("#container-main").attr("clusterNumber");
    var status=d3.select("#container-main").attr("status");
    var rootPath = 'data/drawData/' + clusterNumber.toString()+'/'+status+'/';
    var areaScale = d3.scaleOrdinal().domain([])
        .range(['#999999','#377eb8','D7EFA1','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#8400E8','#e41a1c'])
    var classScale = d3.scale.category20();
    return {
        rootPath: rootPath,
        clusterNumber: clusterNumber,
        status:status,
        normal_opacity: 0.5,
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