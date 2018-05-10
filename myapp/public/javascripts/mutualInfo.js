function getMutualInfo(mapCluster, parallelCluster, nuclearResult) {

    for (var i = 0; i < parallelCluster.length; i++) {
        if (parallelCluster[i] === undefined) {

        }
        // parallelCluster[i] = $.grep(parallelCluster[i],function(n){ return n == 0 || n });
        // parallelCluster[i] = parallelCluster[i].filter(function(n){ return n != undefined }); 
        for (var j = 0; j < parallelCluster[i].length; j++) {
            if (parallelCluster[i][j] === undefined) {

                parallelCluster[i][j] = [];
            }
        }
    }

    var mutualInfoArray = [];
    //testMutualInfo();

    function testMutualInfo() {
        var testCluster = [];
        testCluster.name = 'test';
        var testCluster = [];
        for (var i = 0; i < mapCluster.length; i++) {
            testCluster[i] = [];
            for (var j = 0; j < mapCluster[i].length; j++) {
                testCluster[i][j] = [];
                testCluster[i][j][0] = 123;
                testCluster[i][j].name = mapCluster[i][j].name;
            }
        }
        var aTest = [];
        for (var i = 0; i < 10; i++) {
            aTest.push(testCluster);
            aTest.name = 'GDPTEST';
        }
        parallelCluster.push(aTest);
    }

    for (var i = 0; i < parallelCluster.length; i++) {
        var kOfKmeans = getAxisK(mapCluster, parallelCluster[i]);
        var axisInfo = {
            index: i,
            k: kOfKmeans,
            parallelCluster: parallelCluster[i][0],
            mutualInfo: getAxisI(mapCluster, parallelCluster[i]),
            name: parallelCluster[i].name
        };
        mutualInfoArray.push(axisInfo);
    }

    var mutualInfoArray2 = cloneObj(mutualInfoArray);
    //  

    var twoMaxInfoArray = getTwoMaxInfo(mutualInfoArray);
    var axisOrder = getOtherAxisOrder(mutualInfoArray, twoMaxInfoArray);

    return axisOrder;

    function testMutualInfo() {
        var testCluster = [];
        testCluster.name = 'test';
        var testCluster = [];
        for (var i = 0; i < mapCluster.length; i++) {
            testCluster[i] = [];
            for (var j = 0; j < mapCluster[i].length; j++) {
                testCluster[i][j] = [];
                testCluster[i][j][0] = 123;
                testCluster[i][j].name = mapCluster[i][j].name;
            }
        }
        var aTest = [];
        for (var i = 0; i < 10; i++) {
            aTest.push(testCluster);
            aTest.name = 'GDPTEST';
        }
        parallelCluster.push(aTest);
    }
}
//for on axis
function getAxisI(mapCluster, axisClusterResult) {
    var axisI = [];
    //  
    for (var i = 0; i < axisClusterResult.length; i++) {
        axisI.push(getOneClusterI(mapCluster, axisClusterResult[i]));
        //  
    }
    var maxI = d3.min(axisI);
    return maxI;
}

function getAxisK(mapCluster, axisClusterResult) {

    return axisClusterResult[0].length;

    /*   var axisI = [];
      for (var i = 0; i < axisClusterResult.length; i++) {
          axisI.push(getOneClusterI(mapCluster, axisClusterResult[i]));
      }
      var maxI = d3.min(axisI, function (d, i) {
          return d;
      });
      var maxIndex = axisI.indexOf(maxI); */

    return maxIndex;
}


//for one cluster result on an axis
function getOneClusterI(mapCluster, OneClusterResult) {
    var Hx = -getHx(mapCluster);
    var clusterCount = 0;
    //  
    for (var i = 0; i < OneClusterResult.length; i++) {
        clusterCount += OneClusterResult[i].length;
    }
    // 
    var Hy = 0;
    /*   */
    for (var i = 0; i < OneClusterResult.length; i++) {
        var Pbj = OneClusterResult[i].length / clusterCount;
        /* 
           
            */
        Hy += (Pbj * Math.log2(Pbj));
    }

    Hy = -Hy;
    var Hxy = 0;
    for (var i = 0; i < mapCluster.length; i++) {
        var thisMapClass = mapCluster[i];
        for (var j = 0; j < OneClusterResult.length; j++) {
            var thisParaClass = OneClusterResult[j];
            var bjai = getbjai(thisMapClass, thisParaClass);
            var ai = getai(mapCluster, thisMapClass);
            if (ai * bjai == 0) {
                Hxy -= 0;
            } else {
                Hxy += (ai * bjai * Math.log2(ai * bjai));
            }
        }
    }

    return -2 * Hxy - Hx - Hy;

}

function getbjai(mapClass, paraClass) {
    var bjai = 0;
    for (var i = 0; i < mapClass.length; i++) {
        if (paraClass === undefined) {
            continue;
        }
        for (var j = 0; j < paraClass.length; j++) {
            if (mapClass[i].name == paraClass[j].name) {
                bjai++;
            }
        }
    }
    bjai = bjai / mapClass.length;
    return bjai;
}

function getai(mapCluster, mapClass) {
    var mapClusterCount = 0;
    for (var i = 0; i < mapCluster.length; i++) {
        mapClusterCount += mapCluster[i].length;
    }
    var ai = mapClass.length / mapClusterCount;
    return ai;
}

function getHx(mapCluster) {
    var mapClusterCount = 0;
    for (var i = 0; i < mapCluster.length; i++) {
        mapClusterCount += mapCluster[i].length;
    }
    var Hx = 0;
    for (var i = 0; i < mapCluster.length; i++) {
        let Pai = mapCluster[i].length / mapClusterCount;
        Hx += (Pai * Math.log2(Pai));
    }
    return Hx;
}

function getTwoMaxInfo(mutualInfoArray) {
    var twoMaxArray = [];
    var maxInfo = d3.min(mutualInfoArray, function (d, i) {
        return d.mutualInfo;
    })
    var maxInfo2 = d3.min(mutualInfoArray, function (d, i) {
        if (d.mutualInfo != maxInfo) {
            return d.mutualInfo;
        }
    })
    for (var i = mutualInfoArray.length - 1; i >= 0; i--) {
        if (mutualInfoArray[i].mutualInfo == maxInfo) {
            twoMaxArray.push(mutualInfoArray[i]);
            mutualInfoArray.splice(i, 1);
            if (twoMaxArray.length == 1) {
                break;
            }
        }
    }

    for (var i = mutualInfoArray.length - 1; i >= 0; i--) {

        if (mutualInfoArray[i].mutualInfo == maxInfo2) {
            twoMaxArray.push(mutualInfoArray[i]);
            mutualInfoArray.splice(i, 1);

            if (twoMaxArray.length == 2) {
                break;
            }
        }
    }


    return twoMaxArray;

}

function getAxisMutualInfo(axis1, axis2) {
    var cluster1 = axis1.parallelCluster;
    var cluster2 = axis2.parallelCluster;
    var Hx = getAxisHx(cluster1);
    var Hy = getAxisHx(cluster2);
    var Hxy = getAxisHxy(cluster1, cluster2);

    return -2 * Hxy - Hx - Hy;

}

function getAxisHx(cluster) {
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

function getAxisHxy(cluster1, cluster2) {
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

function getAxisBjAi(class1, class2) {
    var same = 0;
    for (var i = 0; i < class1.length; i++) {
        for (var j = 0; j < class2.length; j++) {
            if (class1[i].name == class2[j].name) {
                same++;
            }
        }
    }
    same = same / class1.length;
    return same;
}



function getOtherAxisOrder(mutualInfoArray, twoMaxInfoArray) {
    var orderArray = [
        [],
        []
    ];
    orderArray[0].push(twoMaxInfoArray[0]);
    orderArray[1].push(twoMaxInfoArray[1]);
    while (mutualInfoArray.length != 0) {
        var maxIArray = [];
        for (var i = 0; i < twoMaxInfoArray.length; i++) {
            for (var j = 0; j < mutualInfoArray.length; j++) {
                maxIArray.push(getAxisMutualInfo(twoMaxInfoArray[i], mutualInfoArray[j]));

            }
        }

        var maxI = d3.min(maxIArray, function (d, i) {
            return d;
        })
        for (var i = 0; i < twoMaxInfoArray.length; i++) {
            for (var j = 0; j < mutualInfoArray.length; j++) {
                if ((getAxisMutualInfo(twoMaxInfoArray[i], mutualInfoArray[j])) == maxI) {
                    orderArray[i].push(mutualInfoArray[j]);
                    twoMaxInfoArray[i] = mutualInfoArray[j];
                    mutualInfoArray.splice(j, 1);
                }
            }
        }
    }

    return orderArray;

}