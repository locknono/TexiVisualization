var options = (function () {

    var areaScale = d3.scaleOrdinal().domain([])
        .range(['#a6cee3', '#1f78b4', '#b2df8a', '#ffff33', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'])
    var classScale = d3.scale.category20();
    return {
        normal_opacity: 1,
        mouseover_opacity: 1,
        suspending_outer_color: "#D6BD3E",
        suspending_inner_color: "#CEDDE8",
        pieview_colorscale: d3.interpolateYlGnBu,
        areaScale: areaScale,
        classScale: classScale,
    }
}())