// append the svg object to the body of the page
const height = 800;
const width = 1200;
var svg = d3.select("#crypto")
  .append("g")
    .attr("transform",
          "translate(50,50)");

//Read the data
d3.csv("Bitcoin.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%m-%d-%Y")(d.Date), value : d.High }
  },

  // Now I can use this dataset:
  function(data) {
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    console.log(data)

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

})