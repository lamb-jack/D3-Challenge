let svgWidth = window.innerWidth/2;
let svgHeight = window.innerHeight/2;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 60
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
    
    // Parse Data/Cast as numbers // I still don't get this part completely
    Data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    
    // Create scale functions

    // let limits = d3.min(Data, d => d.healthcare); // To get an idea of the domain values,
    // console.log(limits);                          // then I kinda eyeballed it
    
    let xLinearScale = d3.scaleLinear()
        .domain([8.5, 23])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([4.5, 27])
        .range([height, 0]);
    

    let h = [];
    let p = [];
    Data.forEach(d => {
      let healthy = d.healthcare;
      let poverty = d.poverty;
      h.push(healthy);
      p.push(poverty);
    })
    console.log(h);
    console.log(p);
      

    
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
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".8");
    
    // Circle Text
    let circleText = chartGroup.append("g")
        .selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style('font-size', '10px')
        .attr('fill', 'white')
        .text(d => d.abbr);  

    // Initialize tool tip
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, 80])
      .html(d => `${d.state}<br>In Poverty: ${d.poverty}%<br>Lacks H: ${d.healthcare}%`);

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
    // Hovering over circleText was causing trouble so i repeated this
    circleText.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

    

}).catch(function(error) {
    console.log(error);
  });