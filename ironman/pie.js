

// size of the svg
var margin = { top: 40, right: 80, bottom: 40, left: 80 },
    w = 800 - margin.left - margin.right,
    h = 350 - margin.top - margin.bottom;
r = Math.min(w, h) / 2

// create svg element
var svg4 = d3.select('#svg4')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr("transform", `translate(${margin.left},${margin.top})`)

d3.json("data/data4.json")
    .then(function (data) {

        var dataset = d3.nest()
            .key(function (d) { return d.Pos_flag; })
            .rollup(function (v) { return d3.sum(v, function (d) { return +d.Freq; }) })
            .entries(data);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        var innerRadius = h / 3;
        var outerRadius = h / 2;

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var arcs = svg4.selectAll('g.arc')
            .data(pie(dataset))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr("transform", `translate(${w / 2},${outerRadius})`)

        arcs.append('path')
            .attr("d", arc)
            .attr('fill', function (d, i) {
                return color(i);
            });

        arcs.append('text')
            .attr('transform', function (d) {
                return "translate(" + arc.centroid(d) + ")"
            })
            .attr('text-anchor', 'middle')
            .text((d => `${d.data.key}: ${d.data.value.toLocaleString()}`))

    });
