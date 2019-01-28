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
var svg3 = d3.select('#svg3')
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
    var elements = Object.keys(data[0]);
    var selectionx = elements[1];
    var selectiony = elements[4];



    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return d[selectionx];
        }), d3.max(data, function (d) {
            return d[selectionx];
        })])
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return d[selectiony];
        }), d3.max(data, function (d) {
            return d[selectiony];
        })])
        .range([h, 0]);


    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    svg3.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("class", "dot")
        .attr('cx', function (d) {
            return xScale(d[selectionx]);
        })
        .attr('cy', function (d) {
            return yScale(d[selectiony]);
        })
        .attr('r', 5);

    svg3.append('g')
        .attr('class', 'y axis')
        .attr("transform", `translate(-10,0)`)
        .call(yAxis);

    svg3.append('g')
        .attr('class', 'x axis')
        .attr("transform", `translate(0,${h + 10})`)
        .call(xAxis);
});

