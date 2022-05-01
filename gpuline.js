// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#gpu")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("gpu.csv",
  function(d){
    return { date : d3.timeParse("%m/%d/%Y")(d.date), price : d.price, gpuName: d.gpuName }
  },
  function(data) {

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.gpuName)}).keys()

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
       var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(3));
    // var x = d3.scaleLinear()
    //   .domain(d3.extent(data, function(d) { return d.year; }))
    //   .range([ 0, width ]);
    // svg.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x).ticks(7));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([500, d3.max(data, function(d) { return +d.price; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.gpuName==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(+d.price) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.gpuName==selectedGroup})

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(+d.price) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})


























// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 800 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#gpu")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// //Read the data
// d3.csv("gpu.csv", 
// function(d){
//   return { date : d3.timeParse("%d/%m/%Y")(d.date), price : d.price, gpuName: d.gpuName }
// },
// function(data) {
//   console.log(data)
//   // group the data: I want to draw one line per group
//   var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
//     .key(function(d) { return d.gpuName;})
//     .entries(data);
//   console.log(sumstat)

//   // Add X axis --> it is a date format
//    // Add X axis --> it is a date format
//    var x = d3.scaleTime()
//    .domain(d3.extent(data, function(d) { return d.date; }))
//    .range([ 0, width ]);
//  xAxis = svg.append("g")
//    .attr("transform", "translate(0," + height + ")")
//    .call(d3.axisBottom(x));
//   // var x = d3.scaleLinear()
//   //   .domain(d3.extent(data, function(d) { return d.date; }))
//   //   .range([ 0, width ]);
//   // svg.append("g")
//   //   .attr("transform", "translate(0," + height + ")")
//   //   .call(d3.axisBottom(x).ticks(5));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, d3.max(data, function(d) { return +d.price; })])
//     .range([ height, 0 ]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // color palette
//   var res = sumstat.map(function(d){ return d.key }) // list of group names
//   var color = d3.scaleOrdinal()
//     .domain(res)
//     .range(['#e41a1c','#377eb8','#4daf4a'])

//   // Draw the line
//   svg.selectAll(".line")
//       .data(sumstat)
//       .enter()
//       .append("path")
//         .attr("fill", "none")
//         .attr("stroke", function(d){ return color(d.key) })
//         .attr("stroke-width", 1.5)
//         .attr("d", function(d){
//           return d3.line()
//             .x(function(d) { return x(d.date); })
//             .y(function(d) { return y(+d.price); })
//             (d.values)
//         })

// })