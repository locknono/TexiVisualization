function addRadarView(axisOrder, gdpData, thisClass, cluster_result) {

  var gdpData2 = cloneObj(gdpData);

  if (thisClass !== undefined) {
    var thisClassGdp = [];

    for (var i = 0; i < cluster_result.length; i++) {
      if (cluster_result[i][0].color == thisClass) {
        thisClassGdp = cluster_result[i];
      }
    }
    var uesdGdpData = [];

    for (var i = 0; i < gdpData.length; i++) {
      for (var j = 0; j < thisClassGdp.length; j++) {
        if (gdpData[i].Prvcnm == thisClassGdp[j].name) {
          uesdGdpData.push(gdpData[i]);
        }
      }
    }
    gdpData = uesdGdpData;
  }
  d3.select('#radarChart').select("svg").selectAll("g").remove();
  var margin = {
    top: 60,
    right: 30,
    bottom: 30,
    left: 30
  };

  ////////////////////////////////////////////////////////////// 
  ////////////////////////// Data ////////////////////////////// 
  ////////////////////////////////////////////////////////////// 

  var div = d3.select("#radarChart");
  var ratio = 3 / 4;
  var width = parseFloat(div.style("width").split("px")[0]) * ratio;
  var height = parseFloat(div.style("height").split("px")[0]) * ratio;

  var data = [];
  var axisSequence = [];

  for (var i = 0; i < axisOrder.length; i++) {
    if (i == 0) {
      for (var j = axisOrder[i].length - 1; j >= 0; j--) {
        axisSequence.push(axisOrder[i][j])
      }
    } else {
      for (var j = 0; j < axisOrder[i].length; j++) {
        axisSequence.push(axisOrder[i][j])
      }
    }
  }


  var data = [];
  var allAxisScale = [];
  
  axisSequence.sort(function(a,b){
    return a.index-b.index;
  })
  for (var i = 0; i < axisSequence.length; i++) {
    
    var radarData = [];
    var thisGdpData = [];
    var thisGdp = axisSequence[i].name;

    var scale = d3.scaleLinear();
    
    for (var j = 0; j < gdpData2.length; j++) {
      if (gdpData2[j][thisGdp] !== undefined) {
        thisGdpData.push(parseFloat(gdpData2[j][thisGdp]))
      }
    }
      let minAxisGdp = d3.min(thisGdpData);
      let maxAxisGdp = d3.max(thisGdpData);
      scale.domain([minAxisGdp, maxAxisGdp])
        .range([0, d3.min([width / 2, height / 2])]);
    allAxisScale.push(scale);
    thisGdpData=[];
    for (var j = 0; j < gdpData.length; j++) {
      if (gdpData[j][thisGdp] !== undefined) {
        thisGdpData.push(parseFloat(gdpData[j][thisGdp]))
      }
    }

    thisGdpData = thisGdpData.sort(function (a, b) {
      return a - b;
    });

    var quarter = parseInt(thisGdpData.length / 4);
    var half = parseInt(thisGdpData.length / 2);
    var threeQuarter = parseInt((thisGdpData.length / 4) * 3);
    var minGdp = d3.min(thisGdpData);
    var maxGdp = d3.max(thisGdpData);
    radarData.push({
      axis: '1/4',
      value: thisGdpData[quarter]
    });
    radarData.push({
      axis: '1/2',
      value: thisGdpData[half]
    });
    radarData.push({
      axis: '3/4',
      value: thisGdpData[threeQuarter]
    });
    radarData.push({
      axis: 'min',
      value: minGdp
    });
    radarData.push({
      axis: 'max',
      value: maxGdp
    });
    data.push(radarData);
  }

  var usedData = [];
  for (var i = 0; i < 3; i++) {
    usedData[i] = [];
    for (var j = 0; j < axisSequence.length; j++) {
      data[j][i].axis = axisSequence[j].name;
      usedData[i].push(data[j][i]);
    }
  }

  ////////////////////////////////////////////////////////////// 
  //////////////////// Draw the Chart ////////////////////////// 
  ////////////////////////////////////////////////////////////// 
  var color = d3.scaleOrdinal()
    .range(['#FCFC00','#4952FF',  '#FF1300']);
  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };

  RadarChart("#radarChart", usedData, radarChartOptions, data, allAxisScale, thisGdpData);

}
