// @TODO: YOUR CODE HERE!
let svgWidth = window.innerWidth/1.5;
let svgHeight = window.innerHeight/1.5;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(Data) {
    console.log(Data);
    
    // Parse Data/Cast as numbers
    Data.forEach(d => {
        Data.age = +d.age;
        Data.smokes = +d.smokes;
    });
    
    // Create scale functions

    // let ageRange = d3.max(Data, d => d.age); // To get an idea of the domain values
    // console.log(Math.round(ageRange));
    
    let xLinearScale = d3.scaleLinear()
        .domain([27, 49])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([9, 29])
        .range([height, 0]);
    
    
    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    let circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".8");

    

    // Initialize tool tip
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Age: ${d.age} (Median)<br>Smokes: ${d.smokes}%`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age (Median)");


}).catch(function(error) {
    console.log(error);
  });