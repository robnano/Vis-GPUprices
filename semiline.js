var margin = {top: 100, right: 100, bottom: 100, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#semi")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

                   
//Read the data
d3.csv("Semiconductors.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.DATE), value : d.IPB53122S }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg1.append("g")
    .attr("stroke", "steelblue")
      .attr("class", "axisRed")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([100, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg1.append("g")
    .attr("stroke", "steelblue")
      .attr("class", "axisRed")
      .call(d3.axisLeft(y));

      // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function(d) { return d.date; }).left;

  // Create the circle that travels along the curve of chart
  var focus = svg1
    .append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "white")
      .attr('r', 8.5)
      .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg1
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")


    // Add the line
    svg1
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
         // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg1
  .append('rect')
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('width', width)
  .attr('height', height)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);


// What happens when the mouse move -> show the annotations at the right positions.
function mouseover() {
  focus.style("opacity", 1)
  focusText.style("opacity",1)
}

function mousemove() {
  // recover coordinate we need
  var x0 = x.invert(d3.mouse(this)[0]);
  var i = bisect(data, x0, 1);
  selectedData = data[i]
  focus
    .attr("cx", x(selectedData.date))
    .attr("cy", y(selectedData.value))
  focusText
    .html("Value: " + selectedData.value)
    .attr("x", x(selectedData.date) + 15)
    .attr("y", y(selectedData.value))
    .attr("stroke", "white")
  }
function mouseout() {
  focus.style("opacity", 0)
  focusText.style("opacity", 0)
}

})