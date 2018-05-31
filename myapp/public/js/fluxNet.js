(function () {
    var svg = d3.select("#netSvg");
    var width = parseFloat(svg.style("width").split('px')[0]),
        height = parseFloat(svg.style("height").split('px')[0]);



    var force = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
                return d.index
            })
            .distance(function (d) {
                console.log('d.value: ', d.value);
                return 200 - Math.pow(1.38, d.value);

            })
        )
        .force("charge", d3.forceManyBody().strength(-2500).distanceMin(0).distanceMax(280))
        .alphaTarget(0.05)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("y", d3.forceY(0.001))
        .force("x", d3.forceX(0.001))

    function dragstarted(d) {
        if (!d3.event.active) force.alphaTarget(0.05).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) force.alphaTarget(0.05);
        d.fx = null;
        d.fy = null;
    }

    d3.json(options.rootPath + "netFlux.json", function (json) {
        d3.json(options.rootPath + "odInter.json", function (data) {
            d3.json(options.rootPath + 'odIn.json', (error, odInData) => {
                var valueRange = d3.extent(json.links, function (d) {
                    return d.value
                })
                console.log('valueRange: ', valueRange);
                var strokeScale = d3.scaleLinear()
                    .domain([valueRange[0] + 3.5, valueRange[1]])
                    .range([2, 20])

                force
                    .nodes(json.nodes)
                    .force("link").links(json.links)

                var link = svg.selectAll(".link")
                    .data(json.links)
                    .enter()
                    .append("line")
                    .attr("stroke", options.forceLineColor)
                    .attr("stroke-width", function (d) {
                        return strokeScale(d.value)
                    })
                    .style("opacity",0.5)
                    .style("cursor", "crosshair")
                    .style("stroke-linecap", "round")
                    .attr("class", "link")
                    .on("click", function (d) {
                        console.log('d: ', d);
                        let source = d.source.class;
                        let target = d.target.class;
                        odView.addLineInterClass(source, target, data)
                    })

                var node = svg.selectAll(".node")
                    .data(json.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                var nodeNumberRange = d3.extent(json.nodes, function (d) {
                    return d.number
                })

                var rScale = d3.scaleLinear()
                    .domain(nodeNumberRange)
                    .range([10, 22])

                node.append('circle')
                    .attr('r', function (d) {
                        return rScale(d.number)
                    })
                    .style('fill', function (d) {
                        return options.areaScale(d.class);
                    })
                    .style("stroke", "none")
                    .attr("id", function (d) {
                        return d.class
                    })
                    .on("mouseover", function (d) {
                        d3.select(this).style("stroke", "black").style("stroke-width", 2)
                        odView.addLineInClass(d.class, odInData);
                        pieView.pieViewInClass(d.class);
                        d3.select("#map").selectAll("[id='" + d.class + "']").style("stroke-width", 1);
                    })
                    .on("mouseout", function (d) {
                        d3.select(this).style("stroke", "none")
                        //d3.select("#map").selectAll("[id='" + d.class + "']").style("opacity", options.normal_opacity);
                        d3.select("#map").selectAll("[id='" + d.class + "']").style("stroke-width", 0.1);
                        mapView.hideDiv();
                    })

                node.append("text")
                    .attr("dx", -18)
                    .attr("dy", 8)
                    .style("font-family", "overwatch")
                    .style("font-size", "18px")
                    .text(function (d) {
                        return d.name
                    });

                force.on("tick", function () {
                    link.attr("x1", function (d) {
                            return d.source.x;
                        })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });
                    node.attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                });
            });
        });
    })
})()