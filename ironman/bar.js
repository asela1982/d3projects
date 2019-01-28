// size of the svg
var margin = { top: 40, right: 80, bottom: 40, left: 80 },
    w = 700 - margin.left - margin.right,
    h = 350 - margin.top - margin.bottom;

// create svg element
var svg1 = d3.select('#svg1')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr("transform", `translate(${margin.left},${margin.top})`)

// create tooltop element
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 10)

// load data
d3.dsv(",", "data/data1.csv", function (d) {
    return {
        Category: d.Category,
        Male: +d.Male,
        Female: +d.Female,
        Overall: +d.Overall // convert "Length" column to number
    };
}).then(function (data) {
    var elements = Object.keys(data[0]);
    var selection = elements[1];

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return +d[selection]
        })])
        .range([h, 0])

    var xScale = d3.scaleBand()
        .domain(data.map(function (d) { return d.Category }))
        .rangeRound([0, w]);

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    svg1.append('g')
        .attr('class', 'y axis')
        .attr("transform", `translate(-10,0)`)
        .call(yAxis);

    svg1.append('g')
        .attr('class', 'x axis')
        .attr("transform", `translate(0,${h + 10})`)
        .call(xAxis)

    svg1.append('g').selectAll("rectangle")
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'rectangle')
        .attr('width', w / data.length - 1)
        .attr('height', function (d) {
            return h - yScale(d[selection]);
        })
        .attr('x', function (d, i) {
            return (w / data.length) * i;
        })
        .attr('y', function (d, i) {
            return yScale(d[selection]);
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);

            tooltip.html("Count: "+ d[selection]+"<br/>"+"Category: "+ d["Category"])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    var selector = d3.select('#drop1')
        .append('select')
        .attr('id', 'dropdown')
        .on('change', function (d) {
            selection = document.getElementById('dropdown');

            yScale.domain([0, d3.max(data, function (d) {
                return +d[selection.value]
            })])

            d3.selectAll(".rectangle")
                .on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 0.9);

                        tooltip.html("Count: "+ d[selection.value]+"<br/>"+"Category: "+ d["Category"])
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                })
                .transition()
                .attr('height', function (d) {
                    return h - yScale(d[selection.value]);
                })
                .attr('x', function (d, i) {
                    return (w / data.length) * i;
                })
                .attr('y', function (d, i) {
                    return yScale(d[selection.value]);
                })
                .duration(500)
                .ease(d3.easeLinear);



            d3.selectAll("g.y.axis")
                .transition()
                .duration(500)
                .call(yAxis)
                .ease(d3.easeLinear);

        })


    selector.selectAll('option')
        .data(elements.slice(1, 4))
        .enter()
        .append('option')
        .attr('value', function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        })

});





