var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    bottom: 80,
    left: 100,
    right: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("fill", "black")
    .attr("class", "chart");

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(myData) {
    console.log("myData", myData);

    myData.forEach(function (st_data){
        st_data.poverty = +st_data.poverty;
        st_data.obesity = +st_data.obesity;
        console.log("obesity", st_data.obesity)
    })

var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(myData, d => d.obesity + 1 )])
    .range([height, 0]);

 var yLinearScale = d3.scaleLinear()
    .domain([5, d3.max(myData, d => d.poverty + 5 )])
    .range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("class", "aText")
    .text("Poverty (%");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("Obesity (%)");
 
var circlesGroup = chartGroup.selectAll("null")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("class", "stateCircle");

var stateAbbr = chartGroup.selectAll()
    .data(myData)
    .enter()
    .append("text");

stateAbbr
    .attr("x", function (d) {
        return xLinearScale(d.obesity);
    })
    .attr("y", function (d) {
        return yLinearScale(d.poverty) + 4
    })
    .text(function (d) {
        return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");
});

var toolTip = d3.tip()
    .attr("class", "d3.tip")
    .offset([50,60])
    .html(function (tp) {
        var theState = "<div>" + tp.state + "%</div>";
        var theX = "<div>Obesity: " + tp.obesity + "%</div>";
        var theY = "<div>Poverty: " + tp.poverty + "%</div>";
        return theState + theX + theY;
    
    });

chartGroup.call(toolTip);

circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
})
    .on("mouseout", function (data) {
        toolTip.hide(data);
    });

