// Casualties.js
// Version 1 11/25/2017
//
// Script that draws the war casualties from the Malgre Nous and German armies
// It is designed for d3 v4
//

//
// Get name of the Json file from HTML attribute given to the script
//
var scripts = document.getElementsByTagName ('script');
for (var s, i = scripts.length; i && (s = scripts[--i]);) {
        if ((t = s.getAttribute ('src')) && (t = t.match (/^(.*)casualties.js(\?\s*(.+))?\s*/))) {
                jsonfile=s.getAttribute('jsonfile');
        }
}

//
// Get size of the window from the size of the HTML element and adapt for
// margins
//

var margin = {top: 20, right: 80, bottom: 40, left: 100};
var width = parseInt(document.getElementById("casualties").style.width,10)-margin.right -margin.left;
var height = parseInt(document.getElementById("casualties").style.height,10)-margin.top-margin.bottom;

var parseDate = d3.timeParse("%m-%Y");

//
// set the ranges
//

var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);
var c0 = function(d) { return d.y0;};
var c1 = function(d) { return d.y1;};

//
// append the svg obgect to the tag with the id "casualties" in the html page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
//

var svg = d3.select("#casualties").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

//
// Get the data from the Json file
//

d3.json(jsonfile, function(error, jdata) {
	if (error) throw error;

	var data = jdata.data;

//
// format the data
//

	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.y0 = +d.y0;
		d.y1 = +d.y1;
	});

//
// Scale the range of the data
//

	x.domain(d3.extent(data, function(d) { return d.date; }));
	y0.domain([0, d3.max(data, function(d) { return d.y0; })]);
	y1.domain([0, d3.max(data, function(d) { return d.y1; })]);

//
// Add the X Axis
//

	xAxis = d3.axisBottom(x);
	y0Axis = d3.axisLeft(y0);
	y1Axis = d3.axisRight(y1);

	var axisX = svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis
		.tickFormat(d3.timeFormat("%Y-%m")))
		.style("font-size","14px")
		.style("stroke", "black")
		.style("stroke-width", 1.0);
	axisX.selectAll("line").attr("fill","none");
	axisX.selectAll("path").attr("fill","none");

//
// Add the Y0 Axis with text label
//

	var axisY0 = svg.append("g")
		.call(y0Axis)
		.style("font-size","14px")
		.style("stroke", "red")
		.style("stroke-width", 1.0);
	axisY0.selectAll("line").attr("fill","none");
	axisY0.selectAll("path").attr("fill","none");

	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.style("font-size","20px")
		.style("stroke", "red")
		.attr("y", -86)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("German casualties");


//
// Add the Y1 Axis with text label
//

	var axisY1 = svg.append("g")
		.attr("transform", "translate(" + width + " ,0)")
		.call(y1Axis)
		.style("font-size","14px")
		.style("stroke", "blue")
		.style("stroke-width", 1.0);
	axisY1.selectAll("line").attr("fill","none");
	axisY1.selectAll("path").attr("fill","none");

	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.style("font-size","20px")
		.style("stroke", "blue")
		.attr("y", width+50)
		.attr("dy", ".75em")
		.attr("transform", "translate(" + width + " ,0)")
		.attr("transform", "rotate(-90)")
		.text("Malgre Nous casualties");

//
// Add box for the plot; fill in in weak yellow...
//

	svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", height)
		.attr("width", width)
		.style("stroke", "black")
		.style("fill", "#ffffff")
		.style("stroke-width", 0.5);

//
// Add the lines
//
	var valueline0 = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y0(d.y0); });
    
	var valueline1 = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y1(d.y1); });
    
	var line1=svg.append("path")  
		.style("stroke", "red")
		.style("stroke-width", "2")
		.attr("fill", "none")
		.attr("d", valueline0(data));

	var line2=svg.append("path")  
		.style("stroke", "blue")
		.style("stroke-width", "2")
		.attr("fill", "none")
		.attr("d", valueline1(data));

//
// Add the scatterplot
//

	svg.selectAll(".dot0")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y0(d.y0); })
		.style("fill", "red");

	svg.selectAll(".dot1")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y1(d.y1); })
		.style("fill", "blue");

});
