// Regions.js
// Version 1 11/25/2017
//
// Script that draws the war casualties from the Malgre Nous and German armies
// on different fronts
// It is designed for d3 v4
//

//
// Get name of the Json file from HTML attribute given to the script
//
var scripts = document.getElementsByTagName ('script');
for (var s, i = scripts.length; i && (s = scripts[--i]);) {
        if ((t = s.getAttribute ('src')) && (t = t.match (/^(.*)regions.js(\?\s*(.+))?\s*/))) {
                jsonfile=s.getAttribute('jsonfile');
        }
}

//
// Get size of the window from the size of the HTML element and adapt for
// margins
//

var margin = {top: 20, right: 150, bottom: 40, left: 30};
var width = parseInt(document.getElementById("casualties").style.width,10)-margin.right -margin.left;
var height = parseInt(document.getElementById("casualties").style.height,10)-margin.top-margin.bottom;

//
// set the ranges
//

var x0 = d3.scaleBand()
	.rangeRound([0,width])
	.paddingInner(0.1);

var x1 = d3.scaleBand()
	.padding(0.05);

var y = d3.scaleLinear()
	.rangeRound([height, 0]);

var color = d3.scaleOrdinal()
	.range(["#ca0020","#0571b0","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

//
// append the svg obgect to the tag with the id "casualties" in the html page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
//

var svg2 = d3.select("#regions").append("svg")
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

	var data = jdata;

	var categoriesNames = data.map(function(d) { return d.categorie; });
	var groupNames = data[0].values.map(function(d) { return d.name; });

//
// Scale the range of the data
//

	x0.domain(categoriesNames);
	x1.domain(groupNames).rangeRound([0, x0.bandwidth()]);
	y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

//
// Add the X Axis
//

	xAxis = d3.axisBottom(x0);
	yAxis = d3.axisLeft(y);

	var axisX = svg2.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.style("font-size","14px")
		.style("stroke", "black")
		.style("stroke-width", 1.0);
	axisX.selectAll("line").attr("fill","none");
	axisX.selectAll("path").attr("fill","none");

//
// Add the Y Axis with text label
//

	var axisY = svg2.append("g")
		.call(yAxis)
		.style("font-size","14px")
		.style("stroke", "black")
		.style("stroke-width", 1.0);
	axisY.selectAll("line").attr("fill","none");
	axisY.selectAll("path").attr("fill","none");

	svg2.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.style("font-size","20px")
		.style("stroke", "black")
		.attr("y", -56)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Casualties (%)");

//
// Add box for the plot; fill in in weak yellow...
//

	svg2.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", height)
		.attr("width", width)
		.style("stroke", "black")
		.style("fill", "#ffffff")
		.style("stroke-width", 0.5);

//
// Add the bar charts
//
	var slice = svg2.selectAll(".slice")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

	slice.selectAll("rect")
		.data(function(d) { return d.values; })
		.enter().append("rect")
		.attr("width", x1.bandwidth())
		.attr("x", function(d) { return x1(d.name); })
		.style("fill", function(d) { return color(d.name) })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.on("mouseover", function(d) {
			d3.select(this).style("fill", d3.rgb(color(d.name)).darker(2));
		})
		.on("mouseout", function(d) {
			d3.select(this).style("fill", color(d.name));
		});

//
// Add legends
//
	var legend = svg2.selectAll(".legend")
//		.data(data[0].values.map(function(d) { return d.name; }).reverse())
		.data(groupNames)
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d,i) { return "translate(0," + i * 30 + ")"; })
//		.style("opacity","0");
		;

	legend.append("rect")
		.attr("x", width - 30)
		.attr("width", 25)
		.attr("height", 25)
		.style("fill", function(d) { return color(d); });

	legend.append("text")
		.attr("x", width - 50)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("font-size","16px")
		.style("stroke", "black")
		.style("text-anchor", "end")
		.text(function(d) {return d; });

});
