// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial X Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// Initial Y Params
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.35,
      d3.max(data, d => d[chosenYAxis]) * 2.75
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
    // var bottomAxis = d3.axisBottom(newXScale);

function renderAxes(newXScale, xAxis, newYScale, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return (xAxis, yAxis);
  }

  // function used for updating circles group with a transition to
// new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating xAxis var upon click on axis label
// function renderAxes(newYScale, yAxis) {
//     var leftAxis = d3.axisBottom(newYScale);
  
//     yAxis.transition()
//       .duration(1000)
//       .call(leftAxis);
  
//     return yAxis;
//   }

  // function used for updating circles group with a transition to
// new circles
// function renderCircles(circlesGroup, newYScale, chosenYaxis) {

//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cy", d => newYScale(d[chosenYAxis]));
  
//     return circlesGroup;
//   }


  // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty";
    }
    else if (chosenXAxis === "age") {
      var label = "Age";
    }
    else {
        var label = "Income";
    }
  
    if (chosenYAxis === "healthcare") {
      var ylabel = "Healthcare";
    }
    else if (chosenYAxis === "smokes") {
      var ylabel = "Smokes";
    }
    else {
        var ylabel = "Obese";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<h6> <strong> ${d.state} </strong><br>${label}: ${d[chosenXAxis]} <br> ${ylabel}: ${d[chosenYAxis]}  </h6>`);
      }
      );
  
    circlesGroup.call(toolTip);
  

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data,this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below.  Tried multiple options based on version.

// The following .csv version is what is noted in the new D3 documentation:
// d3.csv(url[[, accessor], callback])
// var url = "assets/data/data.csv"
// d3.csv(url, [function(d) { return {key: d.key, value: +d.value}; }], [function(err, journalData){ 

// var file = "assets/data/data.csv"
// d3.csv(file).then(successHandle, errorHandle);

// The following .csv version will work with D3 version 5.5:
var url = "assets/data/data.csv"
d3.csv(url).then(function(journalData){
  //     if (err) throw err;
  vizualize(journalData)
  // console.log(journalData);
})

// The following .csv version will work with D3 version 4.13:
// d3.csv(url, function(err, journalData) {
//     if (err) throw err;
//     console.log(journalData);
//     // parse data

function vizualize(journalData){
    journalData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthCare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      // console.log(data);
    });
   
    // xLinearScale function above csv import
    var xLinearScale = xScale(journalData, chosenXAxis);
    // console.log(xLinearScale);

    // yLinearScale function above csv import
    var yLinearScale = yScale(journalData, chosenYAxis);
    // console.log(yLinearScale);

    // Create y scale function
    // var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(journalData, d => d.healthcare)])
    // .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(${height}, 0)`)
        .call(leftAxis);

    // Add rightAxis to the right side of the display
    // var rightyAxis = chartGroup.append("g").attr("transform", `translate(${width}, 0)`).call(rightAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(journalData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("fill", "steelblue")
        .attr("opacity", ".5")
        // .text(d => (d.abbr));
        // .append("text").text(function(d) {
        //   console.log(d.abbr);
        //   return d.abbr;
        // });

    var abbr = chartGroup.selectAll("label")
        .data(journalData) //change this to your data
        .enter()
        .append("text")
        .attr("class", "label")
        .text((d) => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        // .attr("class", "stateText")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black")
    // circlesGroup = chartGroup.selectAll("text")
    //     .data(journalData)
    //     .enter()
    //     .append("text")
    //     .attr("cx", d => xLinearScale(d[chosenXAxis]))
    //     .attr("cy", d => yLinearScale(d[chosenYAxis]))
    //     .style("font-size", "10px")
    //     .text(d => (d.abbr));       
    // circlesGroup.append("text")
    //     .text(function(d){
    //       return (d.abbr);
    //     })
    //     .attr("class", "stateText")
    //     .attr("font-size", "10px")
        // .attr("dx", function (d) {
        //   // return x(d.x);
        //   return dx(d[chosenXAxis]);
        // })
        // // .attr("dx", d => xLinearScale(d[chosenXAxis]))
        
        // .attr("dy", function (d) {
        //   // return y(d.y);
        //   return dy(d[chosenYAxis]);
        // })
        
        // .attr("dy", d => yLinearScale(d[chosenYAxis]));
    

    // Create group for  3 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 3}, ${height + 30})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("axis", "x")
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 30)
        .attr("axis", "x")
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var houseHoldLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("axis", "x")
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    // append y axis
    // chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Number of Billboard 500 Hits");
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        // .attr("`translate(${width / 2}, ${height + 20})`);
    
    var healthCareLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        // .classed("axis-text", true)
        .attr("axis", "y")
        .attr("value", "healthcare") // value to grab for event listener
        .text("Lacks Healthcare (%)");

    var smokeCareLabel = ylabelsGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("axis", "y")
        .attr("value", "smokes") // value to grab for event listener
        .text("Smokes (%)");   

    var obeseCareLabel = ylabelsGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("axis", "y")
        .attr("value", "obesity") // value to grab for event listener
        .text("Obese (%)");

    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      var axis = d3.select(this).attr("axis");
      // if (axis !== "x") {
        if (value !== chosenXAxis) {
          // So !== will return true if the operands are not equal and/or not of the same type.
          // replaces chosenXAxis with value
          chosenXAxis = value;
          // chosenYAxis = yvalue;
          
          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(journalData, chosenXAxis);
          yLinearScale = yScale(journalData, chosenYAxis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
          yAxis = renderAxes(yLinearScale, yAxis);

          // updates circles with new x values
          // circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates tooltips with new info
          // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            houseHoldLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            houseHoldLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            houseHoldLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        

      // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthCareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeCareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseCareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokeCareLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseCareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokeCareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseCareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
  // }
    });
  }