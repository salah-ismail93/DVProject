// Width and height of the chart
var width = 400;
var height = 400;

// Radius of the pie chart
var radius = Math.min(width, height) / 2;

// Color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Create SVG element
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Read data from CSV file
d3.csv("../data/world_total_death_pie_data.csv").then(function (data) {
  data.forEach(function (d) {
    d.total_no_deaths = +d.total_no_deaths;
    d.percentage = +d.percentage;
  });

  // Calculate total deaths
  var totalDeaths = d3.sum(data, function (d) {
    return d.total_no_deaths;
  });

  // Generate pie chart
  var pie = d3
    .pie()
    .value((d) => d.total_no_deaths)
    .sort(null);

  var path = d3.arc().outerRadius(radius).innerRadius(0);

  var arc = svg.selectAll("arc").data(pie(data)).enter();

  arc
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => color(d.data.continent))
    .attr("stroke", "white")
    .attr("stroke-width", "2px")
    .on("mouseover", function (e,d) {
      tooltip
        .html(
          d.data.continent +
            "<br>" +
            d.data.total_no_deaths +
            " (" +
            ((d.data.total_no_deaths / totalDeaths) * 100).toFixed(2) +
            "%)"
        )
        .style("visibility", "visible");
    })
    .on("mousemove", function () {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });

  // Add tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  // Create legend
  var legendSvg = d3
    .select("#legend")
    .append("svg")
    .attr("width", 300)
    .attr("height", height);

  var legendItems = legendSvg
    .selectAll(".legend-item")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function (d, i) {
      var itemHeight = 20;
      var itemSpacing = 10;
      var legendHeight = data.length * itemHeight + (data.length - 1) * itemSpacing;
      var offsetY = (height - legendHeight) / 2;
      return "translate(0," + (offsetY + i * (itemHeight + itemSpacing)) + ")";
    });

  legendItems
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d) => color(d.data.continent));

  legendItems
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(function (d) {
      return (
        d.data.continent +
        " (" +
        ((d.data.total_no_deaths / totalDeaths) * 100).toFixed(2) +
        "%)"
      );
    });
});