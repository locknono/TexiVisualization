var odView = (function () {
    /*  var svg = d3.select("#odSvg");
     var width = parseFloat(svg.style("width").split('px')[0]),
         height = parseFloat(svg.style("height").split('px')[0]); */
    var canvas = d3.select("#odCanvas");
    var width = parseFloat(canvas.style("width").split('px')[0]),
        height = parseFloat(canvas.style("height").split('px')[0]);
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
        .range([margin.left + 0.5*margin.left, (width - margin.right)]);

    var axisXSacleBottom = d3.scaleLinear()
        .domain([0, 1440])
        .range([(width - margin.right), margin.left + 0.5*margin.left]);

    var stage = new PIXI.Container(); //创建一个舞台
    var ScatterPlotGraphics = new PIXI.Graphics() //创建一直画笔
    stage.addChild(ScatterPlotGraphics); //将画笔添加到舞台上
    var lineCanvas = document.getElementById("odCanvas"); //设置canvas变量
    //定义渲染器渲染在canvas上
    var renderer = PIXI.autoDetectRenderer(width, height, {
        view: lineCanvas,
        forceFXAA: false,
        antialias: true,
        transparent: !0,
        resolution: 1,
    });
    //将渲染器添加到dom节点上
    document.getElementById("odView").appendChild(renderer.view);
    //range X:transform + margin
    /* svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(axis); */

    function addLineInClassOnCanvas(classId, data) {
        //开始用画笔画点
        ScatterPlotGraphics.clear();

        var controlPointYScale = d3.scaleLinear()
            .domain([0, width - margin.left - margin.right])
            .range([margin.top - 15, -margin.top])

        ScatterPlotGraphics.lineStyle(1, 0x4682B4, options.odLineOpacity)
        for (var j = 0; j < data[classId].od.length; j++) {

            let source = axisXSacle(data[classId].od[j][0]),
                target = axisXSacle(data[classId].od[j][1]);
            //此时的source,target代表轴上的坐标,坐标原点是左上角（0,0）
            let diffLength = target - source;
            let controlPointY = controlPointYScale(diffLength);

            ScatterPlotGraphics.moveTo(source, margin.top);
            ScatterPlotGraphics.quadraticCurveTo(((source + target) / 2), controlPointY, target, margin.top);
        }
        ScatterPlotGraphics.x = 0;
        ScatterPlotGraphics.y = 0;
        renderer.render(stage);
    }

    function addLineInterClassOnCanvas(sourceClassId, targetClassId, data) {
        console.log('data: ', data);
        var drawData = []
        for (var i = 0; i < data.length; i++) {
            if (data[i].direc.indexOf(sourceClassId) != -1 && data[i].direc.indexOf(targetClassId) != -1) {
                drawData.push(data[i])
            }
        }
        console.log('drawData: ', drawData);
        //开始用画笔画点
        ScatterPlotGraphics.clear();
        
        const SEC = 5;

        var controlPointYScale = d3.scaleLinear()
            .domain([0, width - margin.left - margin.right])
            .range([margin.top - 15-SEC, margin.top - 1.8 * margin.top])

        var controlPointYScaleBottom = d3.scaleLinear()
            .domain([0, width - margin.left - margin.right])
            .range([margin.top + 15+SEC, margin.top + 1.8 * margin.top])

        ScatterPlotGraphics.lineStyle(1, 0x4682B4, options.odLineOpacity)

        

        for (var i = 0; i < drawData.length; i++) {
            if (i % 2 == 0) {
                let firstOD = drawData[i].od;
                for (var j = 0; j < firstOD.length; j++) {
                    let source = axisXSacle(firstOD[j][0]),
                        target = axisXSacle(firstOD[j][1]);
                    let diffLength = target - source;
                    let controlPointY = controlPointYScale(diffLength);
                    ScatterPlotGraphics.moveTo(source, margin.top-SEC);
                    ScatterPlotGraphics.quadraticCurveTo(((source + target) / 2), controlPointY, target, margin.top-SEC);
                }
            } else if (i % 2 != 0) {
                let secondOD = drawData[i].od;
                for (var j = 0; j < secondOD.length; j++) {
                    let source = axisXSacleBottom(secondOD[j][0]),
                        target = axisXSacleBottom(secondOD[j][1]);
                    let diffLength = source - target;
                    let controlPointY = controlPointYScaleBottom(diffLength);
                    ScatterPlotGraphics.moveTo(source, margin.top+SEC);
                    ScatterPlotGraphics.quadraticCurveTo(((source + target) / 2), controlPointY, target, margin.top+SEC);
                }
            }
        }
        ScatterPlotGraphics.x = 0;
        ScatterPlotGraphics.y = 0;
        renderer.render(stage);
    }


    function getOdInData() {
        return new Promise(function (resolve, reject) {
            d3.json('data/drawData/odIn.json', (error, data) => {
                resolve(data);
            })
        })
    }

    function addLineInClassOnSvg(classId) {
        //把坐标差映射成高度
        //坐标差最小为0，最大是轴的长度
        svg.selectAll(".lineG").remove();
        var controlPointYScale = d3.scaleLinear()
            .domain([0, width - margin.left - margin.right])
            .range([margin.top - 15, -margin.top])
        var lineG = svg.append("g")
            .attr("class", "lineG")
        d3.json('data/drawData/odIn.json', (error, data) => {
            for (var j = 0; j < data[classId].od.length; j++) {
                let source = axisXSacle(data[classId].od[j][0]),
                    target = axisXSacle(data[classId].od[j][1]);
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
        })
    }
    return {
        addLineInterClass: addLineInterClassOnCanvas,
        addLineInClass: addLineInClassOnCanvas,
        getOdInData: getOdInData
    }
}())