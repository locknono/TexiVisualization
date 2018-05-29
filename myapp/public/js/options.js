var options = (function () {

    var areaScale = d3.scaleOrdinal().domain([])
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ffff33', '#ff7f00', ])

    return {
        normal_opacity: 0.6,
        mouseover_opacity: 1,
        suspending_outer_color: "#D6BD3E",
        suspending_inner_color: "#CEDDE8",
        pieview_colorscale: d3.interpolateYlGnBu,
        areaScale: areaScale
    }
}())