(function () {
    var svg = d3.select("#odSvg");
    var width = parseFloat(svg.style("width").split('px')[0]),
        height = parseFloat(svg.style("height").split('px')[0]);
    console.log('width: ', width);
    console.log('height: ', height);

    var margin = {
        left: 20,
        right: 20,
        top: 140
    };
    var timeScale = d3.scaleLinear()
        .domain([0, 1440])
        .range([margin.left, width - margin.left - margin.right])


    var axis = d3.axisBottom(timeScale);

    var axisXSacle = d3.scaleLinear()
        .domain([0, 1440])
        .range([margin.left + margin.left, (width - margin.right)]);
    //range X:transform + margin


    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(axis);

    function addLineInClass() {
        //把坐标差映射成高度
        //坐标差最小为0，最大是轴的长度
        var controlPointYScale = d3.scaleLinear()
            .domain([0, width - margin.left - margin.right])
            .range([margin.top - 15, -80])
        var lineG = svg.append("g")
            .attr("class", "lineG")
        d3.json('data/drawData/odIn.json', (error, data) => {
            console.log('data: ', data);

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].od.length; j++) {
                    if (i != 6) {
                        continue
                    }
                    let source = axisXSacle(data[i].od[j][0]),

                        target = axisXSacle(data[i].od[j][1]);

                    //此时的source,target代表轴上的坐标,坐标原点是左上角（0,0）
                    let diffLength = target - source;
                    let controlPointY = controlPointYScale(diffLength);

                    let path = d3.path();
                    path.moveTo(source, margin.top);
                    path.quadraticCurveTo(((source + target) / 2), controlPointY, target, margin.top);
                    lineG.append("path")
                        .attr("d", path)
                        .attr("stroke", "black")
                        .attr("fill", "none")
                }
            }
        })
    }
    addLineInClass()
}())