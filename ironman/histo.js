

// function to convert hh:mm:ss to decimal hours
function timeToDecimalHours(t) {
    var arr = t.split(':');
    var seconds2hrs = parseFloat(arr[2] / 3600);
    var minutes2hrs = parseFloat(arr[1] / 60);
    var hours = parseFloat(arr[0])
    return seconds2hrs + minutes2hrs + hours;
};


// size of the svg
var margin = { top: 40, right: 80, bottom: 40, left: 80 },
    w = 800 - margin.left - margin.right,
    h = 350 - margin.top - margin.bottom;

// create svg element
var svg2 = d3.select('#svg2')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr("transform", `translate(${margin.left},${margin.top})`)

// load data

d3.dsv(",", "data/data2.csv", function (d) {
    return {
        swim: timeToDecimalHours(d.Swim),
        t1: timeToDecimalHours(d.T1),
        cycle: timeToDecimalHours(d.Cycle),
        t2: timeToDecimalHours(d.T2),
        run: timeToDecimalHours(d.Run)
    };
}).then(function (data) {

    var elements = Object.keys(data[0])

    var selection = data.map(a => a.swim);

    x = d3.scaleLinear()
        .domain(d3.extent(selection)).nice()
        .range([0, w])

    var histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20));

    var bins = histogram(selection);

    y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([h, 0])


    svg2.append('g').selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr('class', 'rectangle2')
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length));


    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    svg2.append('g')
        .attr('class', 'y axis2')
        .attr("transform", `translate(-10,0)`)
        .call(yAxis);

    svg2.append('g')
        .attr('class', 'x axis2')
        .attr("transform", `translate(0,${h + 10})`)
        .call(xAxis)

    var mean = parseFloat(d3.mean(selection)).toFixed(2)
    var median = parseFloat(d3.median(selection)).toFixed(2)
    var deviation = parseFloat(d3.deviation(selection)).toFixed(2)
    var variance = parseFloat(d3.variance(selection)).toFixed(2)

    var statArray = [{ mean: mean }, { median: median }, { deviation: deviation }, { variance: variance }];

    svg2.append('g')
        .selectAll("text.labels")
        .data(statArray)
        .enter()
        .append("text")
        .attr('class', 'text2a')
        .attr("x", w)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return Object.values(d);
        });

    svg2.append('g')
        .selectAll("text.labels")
        .data(statArray)
        .enter()
        .append("text")
        .attr('class', 'text2b')
        .attr("x", w - 100)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("text-anchor", "left")
        .text(function (d) {
            return Object.keys(d);
        });


    var selector = d3.select('#drop2')
        .append('select')
        .attr('id', 'dropdown2')
        .on('change', function (d) {
            item = document.getElementById('dropdown2');
            var selection = data.map(a => a[item.value]);

            x.domain(d3.extent(selection)).nice()

            var histogram = d3.histogram()
                .domain(x.domain())
                .thresholds(x.ticks(20));

            var bins = histogram(selection);

            y.domain([0, d3.max(bins, d => d.length)]).nice()

            d3.selectAll(".rectangle2")
                .data(bins)
                .transition()
                .attr("x", d => x(d.x0) + 1)
                .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
                .attr("y", d => y(d.length))
                .attr("height", d => y(0) - y(d.length))
                .duration(500)
                .ease(d3.easeLinear);


            d3.selectAll("g.y.axis2")
                .transition()
                .duration(500)
                .call(yAxis)
                .ease(d3.easeLinear);

            d3.selectAll("g.x.axis2")
                .transition()
                .duration(500)
                .call(xAxis)
                .ease(d3.easeLinear);


            var mean = parseFloat(d3.mean(selection)).toFixed(2)
            var median = parseFloat(d3.median(selection)).toFixed(2)
            var deviation = parseFloat(d3.deviation(selection)).toFixed(2)
            var variance = parseFloat(d3.variance(selection)).toFixed(2)

            var statArray = [{ mean: mean }, { median: median }, { deviation: deviation }, { variance: variance }];

            console.log(statArray);

            d3.selectAll("text2a")
                .data(statArray)
                .transition()
                .duration(500)
                .text(function (d) {
                    return Object.keys(d);
                })
                .ease(d3.easeLinear);

            d3.selectAll("text2b")
                .data(statArray)
                .transition()
                .duration(500)
                .ease(d3.easeLinear);
        })


    selector.selectAll('option')
        .data(elements)
        .enter()
        .append('option')
        .attr('value', function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        })


});




