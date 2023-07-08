// Set up chart dimensions
const margin = { top: 50, right: 100, bottom: 70, left: 70 };
const width2 = 600 - margin.left - margin.right;
const height2 = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg2 = d3
  .select("#scatterplot")
  .attr("width", width2 + margin.left + margin.right)
  .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create the legend container
const legendContainer = d3
  .select("#chart-container")
  .append("svg")
  .attr("id", "legend")
  .attr("width", 300)
  .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data from CSV file
d3.csv("../data/scatter_data.csv").then(function (parsedData) {
  // Extract unique values from the "Regional_indicator" column
  const legends = [...new Set(parsedData.map((d) => d.Regional_indicator))];

  // Define colors for each legend
  const colorScale = d3
    .scaleOrdinal()
    .domain(legends)
    .range(d3.schemeCategory10);

  // Scale for the x-axis
  const xScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(parsedData, (d) => parseFloat(d.ratio_total_deaths) * 100),
    ])
    .range([0, width2]);

  // Scale for the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(parsedData, (d) => parseFloat(d.ratio_total_cases) * 100),
    ])
    .range([height2, 0]);

  // Scale for the point sizes
  const sizeScale = d3
    .scaleLinear()
    .domain(
      d3.extent(parsedData, (d) => parseFloat(d.ratio_total_vaccinations))
    )
    .range([2, 10]);

  // Add dots to the chart
  svg2
    .selectAll(".dot")
    .data(parsedData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(parseFloat(d.ratio_total_deaths) * 100))
    .attr("cy", (d) => yScale(parseFloat(d.ratio_total_cases) * 100))
    .attr("r", (d) => sizeScale(parseFloat(d.ratio_total_vaccinations)))
    .style("fill", (d) => colorScale(d.Regional_indicator))
    .on("mouseover", showTooltip)
    .on("mousemove", updateTooltip)
    .on("mouseout", hideTooltip);

  function showTooltip(event, d) {
    const tooltip = d3.select(".tooltip");
    tooltip
      .style("display", "block")
      .html(
        `<strong>${d.location}</strong><br>
                  Total Vaccination: ${parseFloat(
                    d.ratio_total_vaccinations
                  ).toFixed(2)}%`
      )
      .style("left", event.pageX + "px")
      .style("top", event.pageY + "px");
  }

  function updateTooltip(event) {
    const tooltip = d3.select(".tooltip");
    tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");
  }

  function hideTooltip() {
    const tooltip = d3.select(".tooltip");
    tooltip.style("display", "none");
  }

  // Add legend
  const legend = legendContainer
    .selectAll(".legend")
    .data(legends)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

  legend
    .append("rect")
    .attr("x", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text((d) => d);

  // Add x-axis label
  svg2
    .append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width2 / 2)
    .attr("y", height2 + margin.bottom - 10)
    .text("Total Deaths/Population (%)");

  // Add y-axis label
  svg2
    .append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", -(height2 / 2))
    .attr("y", -margin.left + 20)
    .attr("transform", "rotate(-90)")
    .text("Total Cases/Population (%)");

  // Add x-axis
  svg2
    .append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg2.append("g").call(d3.axisLeft(yScale));
});
