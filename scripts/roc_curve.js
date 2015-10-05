/**
 * Created by axelr on 05.10.15.
 */
// defining global constants
var w = 345., h = 350., padding = 30.;
var mean1 = 1., mean2 = 0., var1 = 2., var2 = 2.;
var threshold = 1.;

var tMin = -3;
var tMax = 5.;
var maxValue = 2.;


function erf(x) {
    var sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);

    // constants
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;

    var t = 1.0 / (1.0 + p * x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y; // erf(-x) = -erf(x);
}

function cdf(x, mean, variance) {
    var normed_x = (x - mean) / (Math.sqrt(2 * variance));
    return 0.5 * (1 + erf(normed_x));
}

function pdf(x, mean, variance) {
    return 1 / Math.sqrt(variance * 2 * Math.PI) * Math.exp(-(x - mean) * (x - mean) / 2. / variance);
}


var xScaleDev = d3.scale.linear()
    .domain([tMin, tMax])
    .range([0., w]);

var yScaleDev = d3.scale.linear()
    .domain([0, maxValue])
    .range([h, 0]);

var xScale = d3.scale.linear()
    .domain([0, 1])
    .range([0., w]);

var yScale = d3.scale.linear()
    .domain([0, 1])
    .range([h, 0]);

var div_left = d3.select("#renderer").append("div");

div_left.attr("class", "block1");

var svg = div_left
    .append("svg")
    .attr("width", w + 2 * padding)
    .attr("height", h + 2 * padding);

svg = svg.append('g')
    .attr("transform", "translate(" + padding + "," + padding + ")")

// Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

// Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

//Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + "," + h + ")")
    .call(xAxis);

//Create Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + ",0)")
    .call(yAxis);

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w - 20)
    .attr("y", h - 10)
    .text("fpr = bkg efficiency");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("tpr = signal efficiency");

var roc_curve_line = d3.svg.line()
    .x(function (d) {
        return xScale(1. - cdf(d, mean1, var1));
    })
    .y(function (d) {
        return yScale(1. - cdf(d, mean2, var2));
    });

var roc_curve_path = svg
    .append("path")
    .attr("class", "line")
    .attr("stroke", "green");

var circle = svg
    .append("circle")
    .attr("cx", xScale(1 - cdf(threshold, mean1, var1)))
    .attr("cy", yScale(1 - cdf(threshold, mean2, var2)))
    .attr("r", 4);

//-------------------------------
var div_right = d3.select("#renderer")
    .append("div")
    .attr("class", "block2");

var svg2 = div_right
    .append("svg")
    .attr("width", w + 2 * padding)
    .attr("height", h + 2 * padding);

svg2 = svg2.append('g')
    .attr("transform", "translate(" + padding + "," + padding + ")")

var pdf_path1 = svg2
    .append("path")
    .attr("class", "line")
    .attr("stroke", "red");


var pdf_path2 = svg2
    .append("path")
    .attr("class", "line")
    .attr("stroke", "blue");

var pdf_area1 = svg2.append('path').attr('class', 'pdf_area1');
var pdf_area2 = svg2.append('path').attr('class', 'pdf_area2');

var drag = d3.behavior.drag()
    .on("drag", function () {
        var thr = threshold + d3.event.dx * (tMax - tMin) / w;
        threshold = Math.min(tMax, Math.max(thr, tMin));
        d3.select(this).attr("x1", xScaleDev(threshold)).attr("x2", xScaleDev(threshold));
        circle
            .attr("cx", xScale(1 - cdf(threshold, mean1, var1)))
            .attr("cy", yScale(1 - cdf(threshold, mean2, var2)));
        draw();
    });

var thresholdLine = svg2.append("line")
    .call(drag)
    .attr('class', 'thresholdLine')
    .attr("stroke", "orange")
    .attr('stroke-width', '2');


//Create X axis
xAxDev = svg2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + "," + h + ")");

//Create Y axis
yAxDev = svg2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + ",0)");

function draw() {
    // parsing arguments
    mean1 = parseFloat($('#mean1').val());
    mean2 = parseFloat($('#mean2').val());
    var1 = parseFloat($('#var1').val());
    var2 = parseFloat($('#var2').val());


    var thresholds = [];
    var right_thresholds = [];

    tMin = Math.min(mean1 - 3 * Math.sqrt(var1), mean2 - 3 * Math.sqrt(var2));
    tMax = Math.max(mean1 + 3 * Math.sqrt(var1), mean2 + 3 * Math.sqrt(var2));
    var N = 1000;
    var delta = (tMax - tMin) / N;

    thresholds[0] = tMin;
    right_thresholds[0] = threshold;

    for (var i = 1; i <= N; i++) {
        thresholds[i] = thresholds[i - 1] + delta;
        right_thresholds[i] = right_thresholds[i - 1] + delta;
    }


    maxValue = Math.max(pdf(mean1, mean1, var1), pdf(mean2, mean2, var2)) * 1.05;

    roc_curve_path.attr("d", roc_curve_line(thresholds));

    xScaleDev.domain([tMin, tMax]);

    yScaleDev.domain([0, maxValue]);

    //Define X axis
    var xAxisDev = d3.svg.axis()
        .orient("bottom")
        .scale(xScaleDev)
        .ticks(5);

    //Define Y axis
    var yAxisDev = d3.svg.axis()
        .orient("left")
        .scale(yScaleDev)
        .ticks(5);

    xAxDev.call(xAxisDev);
    yAxDev.call(yAxisDev);

    var deviation1 = d3.svg.line()
        .x(function (d) {
            return xScaleDev(d);
        })
        .y(function (d) {
            return yScaleDev(pdf(d, mean1, var1));
        });

    var deviation2 = d3.svg.line()
        .x(function (d) {
            return xScaleDev(d);
        })
        .y(function (d) {
            return yScaleDev(pdf(d, mean2, var2));
        });


    pdf_path1.attr("d", deviation1(thresholds));

    pdf_path2.attr("d", deviation2(thresholds));

    var _area1 = d3.svg.area()
        .x(function (d) {
            return xScaleDev(d);
        })
        .y0(function (d) {
            return yScaleDev(d * 0);
        })
        .y1(function (d) {
            return yScaleDev(pdf(d, mean1, var1));
        });

    var _area2 = d3.svg.area()
        .x(function (d) {
            return xScaleDev(d);
        })
        .y0(function (d) {
            return yScaleDev(d * 0);
        })
        .y1(function (d) {
            return yScaleDev(pdf(d, mean2, var2));
        });

    pdf_area1.attr('d', _area1(right_thresholds));

    pdf_area2.attr('d', _area2(right_thresholds));

    thresholdLine
        .attr("x1", xScaleDev(threshold))
        .attr("y1", yScaleDev(0))
        .attr("x2", xScaleDev(threshold))
        .attr("y2", yScaleDev(maxValue));

    circle
        .attr("cx", xScale(1 - cdf(threshold, mean1, var1)))
        .attr("cy", yScale(1 - cdf(threshold, mean2, var2)));
}

draw();