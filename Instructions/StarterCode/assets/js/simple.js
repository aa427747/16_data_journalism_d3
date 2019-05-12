// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the data.csv file
// =================================
// d3.csv("assets/data/data.csv", function(error, journalismData) {
  
  // if (error) throw error;
  // console.log(journalismData);

var url = "assets/data/data.csv"
  d3.csv(url).then(function(journalData){
    vizualize(journalData)
    console.log(journalData);
  })

  // Step 4: Format the data
  // =================================
function vizualize(journalData){
  journalData.forEach(function(data) {
    // data.state = data.abbr
    data.poverty = +data.poverty;
    data.healthCare = +data.healthcare;
    // console.log(data);
  });

  // Step 5: Create the scales for the chart
  // =================================
  var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(journalData, d => d.poverty)])
      .range([0, width]);

  var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(journalData, d => d.healthCare)])
      .range([height, 0]);

 
  // Step 6: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // Step 7: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  // Step 9: Create Circles
    // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "steelblue")
    .attr("opacity", ".5");
  
  var abbr = chartGroup.selectAll("label")
    .data(journalData) //change this to your data
    .enter()
    .append("text")
    .attr("class", "label")
    .text((d) => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    // .attr("class", "stateText")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "black")

  // Create y-axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.90))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Healthcare (%)")
    .classed("active", true); 

  // X-Label
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty (%)")
    .classed("active", true); 

};