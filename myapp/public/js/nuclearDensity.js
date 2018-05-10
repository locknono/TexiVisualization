function nuclearDensity(gdpData, CIGMA = 2) {

    const SECTION = 100,
        AXISLENGTH = 300;
    var sectionArray = d3.range(0, AXISLENGTH + AXISLENGTH / SECTION, AXISLENGTH / SECTION);


    var indusNames = Object.keys(gdpData[0]).filter(function (value) {
        return value != 'Prvcnm'
    });


    var clusterResult = [];

    for (var i = 0; i < indusNames.length; i++) {
        let thisIndusName = indusNames[i];

        let gdpExtent = d3.extent(gdpData, function (d) {
            return parseFloat(d[thisIndusName]);
        })

        let axisScale = d3.scaleLinear()
            .domain(gdpExtent)
            .range([0, AXISLENGTH]);

        let thisIndusGdp = [];

        for (var j = 0; j < gdpData.length; j++) {
            thisIndusGdp.push(axisScale(parseFloat(gdpData[j][thisIndusName])));
            thisIndusGdp.name = thisIndusName;
        }
        clusterResult[i] = axisNuclear(thisIndusGdp);
        clusterResult[i].name = thisIndusName;
    }
    console.log('clusterResult: ', clusterResult);
    return clusterResult;
    //for one axis
    function axisNuclear(thisIndusGdp) {
        let thisIndusName = thisIndusGdp.name;
        var sectionValueArray = [];
        for (var i = 0; i < sectionArray.length; i++) {
            sectionValueArray[i] = 0;
        }
        for (var i = 0; i < thisIndusGdp.length; i++) {
            let u = thisIndusGdp[i];
            sectionValueArray = normalDistribution(u, sectionValueArray);
        }

        var troughArray = getTrough(sectionValueArray);

        var clusterResult = [];
        for (var i = 0; i < troughArray.length; i++) {
            if (i === 0) {
                clusterResult[0] = [];
            } else if (i === troughArray.length - 1) {
                clusterResult[troughArray.length - 1] = [];
                clusterResult[troughArray.length] = [];
            } else {
                clusterResult[i] = [];
            }
            for (var j = 0; j < thisIndusGdp.length; j++) {
                if (i === 0) {
                    if (thisIndusGdp[j] <= troughArray[0] * (AXISLENGTH / SECTION)) {
                        var gdp = getObj(gdpData, j, thisIndusName);
                        clusterResult[0].push(gdp);
                    }
                } else if (i === troughArray.length - 1) {
                    if (thisIndusGdp[j] >= troughArray[troughArray.length - 1] * (AXISLENGTH / SECTION)) {
                        var gdp = getObj(gdpData, j, thisIndusName);
                        clusterResult[troughArray.length].push(gdp);
                    }
                    if (thisIndusGdp[j] >= troughArray[i - 1] * (AXISLENGTH / SECTION) &&
                        thisIndusGdp[j] <= troughArray[i] * (AXISLENGTH / SECTION)) {
                        var gdp = getObj(gdpData, j, thisIndusName);
                        clusterResult[i].push((gdp));
                    }
                } else {
                    if (thisIndusGdp[j] >= troughArray[i - 1] * (AXISLENGTH / SECTION) &&
                        thisIndusGdp[j] <= troughArray[i] * (AXISLENGTH / SECTION)) {
                        var gdp = getObj(gdpData, j, thisIndusName);
                        clusterResult[i].push((gdp));
                    }
                }
            }
        }
        console.log('clusterResult: ', clusterResult);
        for (var i = clusterResult.length - 1; i >= 0; i--) {
            if (clusterResult[i].length === 0) {
                clusterResult.splice(0, 1);
            }
        }
        return clusterResult;


    }

    function getObj(gdpData, j, thisIndusName) {
        var gdp = {};
        gdp.name = gdpData[j].Prvcnm;
        gdp.value = parseFloat(gdpData[j][thisIndusName])
        return gdp;
    }

    function normalDistribution(u, sectionValueArray) {
        let extent = [u - 3 * CIGMA, u + 3 * CIGMA];

        for (var i = 0; i < sectionArray.length; i++) {
            if (sectionArray[i] >= extent[0] && sectionArray[i] <= extent[1]) {
                let x = sectionArray[i];
                let fx = getFx(x);
                sectionValueArray[i] += fx;
            }
        }
        return sectionValueArray;

        //closure
        function getFx(x) {
            let pow = -(Math.pow(x - u, 2) / (2 * Math.pow(CIGMA, 2)));
            let fx = (1 / (CIGMA * Math.sqrt(2 * Math.PI))) *
                Math.pow(Math.E, pow);
            return fx;
        }
    }

    function getTrough(sectionValueArray) {
        var troughArray = [];
        for (var i = 1; i < sectionValueArray.length - 1; i++) {
            if (sectionValueArray[i] < sectionValueArray[i - 1] &&
                sectionValueArray[i] < sectionValueArray[i + 1]) {
                troughArray.push(i);
            }
        }
        return troughArray;
    }



}