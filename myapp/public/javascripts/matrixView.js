 function addMarixView(axisOrder, cluster_result, systemName, curSelectedMapClass) {



   if (curSelectedMapClass) {

     var cluster_result = [cloneObj(cluster_result)[curSelectedMapClass]]

   }

   var svg = d3.select("#matrixSvg");
   svg.selectAll("g").remove();

   var svgWidth = parseFloat(svg.style("width").split("px")[0])
   var svgHeight = parseFloat(svg.style("height").split("px")[0])


   var matrixData = [];
   var count = 0;
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

   for (var i = 0; i < axisOrder.length; i++) {
     if (i == 0) {
       for (var j = axisOrder[i].length - 1; j >= 0; j--) {
         matrixData[count] = [];
         matrixData[count].name = axisOrder[i][j].name;
         count++;
       }
     } else {
       for (var j = 0; j < axisOrder[i].length; j++) {
         if (j == 0) {
           matrixData[count] = [];
           matrixData[count].name = 'map';
           count++;
         }
         matrixData[count] = [];
         matrixData[count].name = axisOrder[i][j].name;
         count++;
       }
     }
   }

   var axisMutualInfoArray = [];
   for (var i = 0; i < axisSequence.length; i++) {
     axisMutualInfoArray[i] = [];
     axisMutualInfoArray[i].name = axisSequence[i].name;
     for (var j = 0; j < axisSequence.length; j++) {
       if (i == j) {
         axisMutualInfoArray[i].push(axisSequence[i].k);
         continue;
       }
       var axis1 = axisSequence[i];
       var axis2 = axisSequence[j];
       var mutualInfo = getMutualInfo(axis1, axis2);
       axisMutualInfoArray[i].push(mutualInfo);
     }
   }


   var mapRow = [];

   for (var i = 0; i < matrixData.length; i++) {
     for (var j = 0; j < axisMutualInfoArray.length; j++) {
       if (matrixData[i].name == axisMutualInfoArray[j].name) {
         matrixData[i] = axisMutualInfoArray[j];
       }
     }
   }

   var mapIndex = -1;

   for (var i = 0; i < matrixData.length; i++) {
     if (matrixData[i].name == 'map') {
       mapIndex = i;
       for (var j = 0; j < axisSequence.length; j++) {
         if (j == mapIndex) {


           mapRow.push(cluster_result.length);

         }
         mapRow.push(axisSequence[j].mutualInfo);
       }
     }
   }



   matrixData[mapIndex] = mapRow;


   for (var i = 0; i < matrixData.length; i++) {
     if (i != mapIndex) {
       matrixData[i].splice(mapIndex, 0, matrixData[mapIndex][i]);
     }
   }



   drawMaxtrie();

   function drawMaxtrie() {
     var defs = svg.append("defs");

     var linearGradient = defs.append("linearGradient")
       .attr("id", "linearColor")
       .attr("x1", "0%")
       .attr("y1", "0%")
       .attr("x2", "100%")
       .attr("y2", "0%");

     var a = '#FFFFFF';
     var b = '#347ed8';
     var stop1 = linearGradient.append("stop")
       .attr("offset", "0%")
       .style("stop-color", a);

     var stop2 = linearGradient.append("stop")
       .attr("offset", "100%")
       .style("stop-color", b);


     var linearGradient = defs.append("linearGradient")
       .attr("id", "linearColor2")
       .attr("x1", "0%")
       .attr("y1", "0%")
       .attr("x2", "100%")
       .attr("y2", "0%");


     var catercornerColor = ['#fee8c8', '#e34a33'];
     var a = catercornerColor[0];
     var b = catercornerColor[1];
     var stop1 = linearGradient.append("stop")
       .attr("offset", "0%")
       .style("stop-color", a);

     var stop2 = linearGradient.append("stop")
       .attr("offset", "100%")
       .style("stop-color", b);
     var margin = {
       top: 70,
       left: 50,
       bottom: 50,
       right: 15
     };
     if (systemName === 'Air') {
       margin.left = 30;
       margin.bottom = 30;
     }


     var colorBarWidth = 70;
     var colorBarHeight = 15;
     var colorBarRectG = svg.append("g")
       .attr("class", "colorBarRectG");
     colorBarRectG.append("text")
       .attr("x", svgWidth - margin.right - colorBarWidth - 6)
       .attr("y", margin.top - 60 + 10)
       .text("互信息").style("font-size", "10px")
       .style("text-anchor", "end")
       .attr("font-family", '"Helvetica Neue",Helvetica,Arial,sans-serif')
     colorBarRectG.append("rect")
       .attr("x", svgWidth - margin.right - colorBarWidth)
       .attr("y", margin.top - 60)
       .style("fill", " url(#linearColor)")
       .attr("width", colorBarWidth)
       .style("stroke", "#F6F9FF")
       .attr("height", colorBarHeight);

     colorBarRectG.append("rect")
       .attr("x", svgWidth - margin.right - colorBarWidth)
       .attr("y", margin.top - 40)
       .style("fill", " url(#linearColor2)")
       .attr("width", colorBarWidth)
       .style("stroke", "#F6F9FF")
       .attr("height", colorBarHeight);
     colorBarRectG.append("text")
       .attr("x", svgWidth - margin.right - colorBarWidth - 6)
       .attr("y", margin.top - 60 + 31)
       .text("K-score").style("font-size", "10px")
       .style("text-anchor", "end")
       .attr("font-family", '"Helvetica Neue",Helvetica,Arial,sans-serif')


     drawWidth = svgWidth - margin.right - margin.left;
     drawHeight = svgHeight - margin.top - margin.bottom;

     var rectWidth = drawWidth / matrixData.length;
     var rectHeight = drawHeight / matrixData[0].length;

     var maxMutualInfo = d3.max(matrixData, function (d, i) {
       return d3.max(d, function (e, j) {
         if (i != j) {
           return e;
         }
       })
     })
     var minMutualInfo = d3.min(matrixData, function (d, i) {
       return d3.min(d, function (e, j) {
         if (i != j) {
           return e;
         }
       })
     })

     var minClusterNumber = d3.min(matrixData, function (d, i) {
       return d3.min(d, function (e, j) {
         if (i == j) {
           return e;
         }
       })
     })

     var maxClusterNumber = d3.max(matrixData, function (d, i) {
       return d3.max(d, function (e, j) {
         if (i == j) {
           return e;
         }
       })
     })

     var colorScale = d3.scaleLinear()
       .domain([minMutualInfo, maxMutualInfo])
       .range([0, 1]);
     var colorInterpolate = d3.interpolate('#FFFFFF', '#347ed8')

     var clusterNumberScale = d3.scaleLinear()
       .domain([minClusterNumber, maxClusterNumber])
       .range([0, 1]);
     var clusterNumberInterpolate = d3.interpolate(catercornerColor[0], catercornerColor[1])
     matrixData[mapIndex].name = 'map';

     var matrixRect = svg.append("g")
       .attr("class", "matrixRect");


     var matrixText = svg.append("g")
       .attr("class", "matrixText");

     //use 'let' here to create a closure which mouseover event depends on 


     for (let i = 0; i < matrixData.length; i++) {
       for (let j = 0; j < matrixData[i].length; j++) {
         matrixRect.append("rect")
           .attr("width", rectWidth)
           .attr("height", rectHeight)
           .attr("x", margin.left + rectWidth * j)
           .attr("y", margin.top + rectHeight * i)
           .style("fill", function () {
             if (i != j) {
               return colorInterpolate(1-colorScale(matrixData[i][j]))
               
             } else if (i == j) {
               return clusterNumberInterpolate(clusterNumberScale(matrixData[i][j]))

             }
           })
           .style("stroke", "#F6F9FF")
           .style("stroke-width", "0.5px")
           .on("mouseover", function (d) {

           })
         if (i == matrixData.length - 1) {
           let x = (margin.left + rectWidth * j) + 7;
           let y = (margin.top + rectHeight * i + 25);
           matrixText.append("text")
             .attr("dx", ".32em")
             .attr("dy", ".32em")
             .style("font-size", "9px")
             .attr("font-family", '"Helvetica Neue",Helvetica,Arial,sans-serif')
             .attr("x", x)
             .attr("y", function () {
               if (systemName === 'Air') {
                 return y + 17;
               }
               return y;
             })
             .style("text-anchor", "end")
             .attr("transform", function () {
               if (systemName === 'Air') {
                 return "rotate(" + (-60) + ", " +
                   (x - 10) + " " + (y + 5) + ")"
               }
               return "rotate(" + (-60) + ", " +
                 x + " " + y + ")"
             })
             .text(function (d) {
               if (matrixData[j].name == '交通运输仓储邮政业') {
                 return '仓储邮政业'
               }
               if (matrixData[j].name == 'map') {
                 return '地图'
               }
               return matrixData[j].name
             });
         }

         if (j == matrixData.length - 1) {
           let x = (margin.left + rectWidth * j);
           let y = (margin.top + rectHeight * i + 40);
           matrixText.append("text")
             .attr("dx", ".32em")
             .attr("dy", ".62em")
             .style("font-size", "9px")
             .attr("font-family", '"Helvetica Neue",Helvetica,Arial,sans-serif')
             .attr("x", margin.left - 6)
             .attr("y", margin.top + rectHeight * i + 5)
             .style("text-anchor", "end")
             .text(function (d) {
               if (matrixData[i].name == '交通运输仓储邮政业') {
                 return '仓储邮政业'
               }
               if (matrixData[i].name == 'map') {
                 return '地图'
               }
               return matrixData[i].name
             });
         }
       }
     }
   }

   function getMutualInfo(axis1, axis2) {
     var Hx = getHx(axis1.parallelCluster);

     var Hy = getHx(axis2.parallelCluster);
     var Hxy = getHxy(axis1.parallelCluster, axis2.parallelCluster);
     return -2 * Hxy - Hx - Hy;
    // return Hx + Hy + Hxy;
   }

   function getHx(cluster) {
     var count = 0;
     for (var i = 0; i < cluster.length; i++) {
       count += cluster[i].length;
     }
     var Hx = 0;
     for (var i = 0; i < cluster.length; i++) {

       var ai = cluster[i].length / count;
       Hx += (ai * Math.log2(ai));
     }
     return -Hx;
   }

   function getHxy(cluster1, cluster2) {
     var count = 0;
     for (var i = 0; i < cluster1.length; i++) {

       count += cluster1[i].length;
     }
     var Hxy = 0;
     for (var i = 0; i < cluster1.length; i++) {
       for (var j = 0; j < cluster2.length; j++) {
         var bjai = getAxisBjAi(cluster1[i], cluster2[j]);
         var ai = cluster1[i].length / count;
         if (ai * bjai == 0) {
           Hxy += 0;
         } else {
           Hxy += (ai * bjai * Math.log2(ai * bjai));
         }
       }
     }
     return Hxy;
   }
 }