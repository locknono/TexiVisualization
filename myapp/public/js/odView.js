(function () {
    var svg = d3.select("#odSvg");
    var width = parseFloat(svg.style("width").split('px')[0]),
        height = parseFloat(svg.style("height").split('px')[0]);
    console.log('width: ', width);
    console.log('height: ', height);
}())