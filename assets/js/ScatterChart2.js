// Set the dimensions and margins of the graph
const margin4 = { top: 20, right: 20, bottom: 100, left: 80 };
const width4 = 750 - margin4.left - margin4.right;
const height4 = 600 - margin4.top - margin4.bottom;

const legendWidth = 500;
const legendHeight = 120;

const legendSvg = d3
  .select("#my_legend")
  .append("svg")
  .attr("width", legendWidth)
  .attr("height", legendHeight);

const tooltip = d3
  .select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("box-shadow", "0px 3px 9px rgba(0, 0, 0, .15)")
  .style("padding", "5px")
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white");

d3.csv("/DVProject/data/scatter_data2.csv")
  .then((data) => {
    const groupedData = data.reduce(function (result, entry) {
      result[entry.Regional_indicator] = result[entry.Regional_indicator] || [];
      result[entry.Regional_indicator].push(entry);
      return result;
    }, Object.create(null));
    console.log(groupedData);

    const groupedRegionalIndicator = Object.keys(groupedData).map((key) => [
      key,
      groupedData[key],
    ]);
    console.log(groupedRegionalIndicator);

    const totalRegionalIndicator = groupedRegionalIndicator.map((d, i) => ({
      region: d[1][0].region,
      value: d[0],
    }));
    console.log(totalRegionalIndicator);

    const getMinMaxValue = function (colName) {
      return d3.extent(data, (d) => +d[colName]);
    };
    const xAxisColumnName = "Population ages 65 and above (% of total)";
    const yAxisColumnName = "COVID-19 Cases (% of total)";

    const highlight = function (event, d) {
      console.log(d);
      const selectedRegionKey = d.region;
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3);

      d3.selectAll("." + selectedRegionKey)
        .transition()
        .duration(200)
        .style("fill", color(selectedRegionKey))
        .attr("r", 7);
    };

    const showTooltip = function (event, d) {
      const selectedRegionKey = d.region;
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3);

      d3.selectAll("." + selectedRegionKey)
        .transition()
        .duration(200)
        .style("fill", color(selectedRegionKey))
        .attr("r", 7);

      tooltip
        .style("visibility", "visible")
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
        .html(
          d.location +
            "<br><span>" +
            "Total cases:  " +
            parseInt(d.total_cases) +
            "<br><span>" +
            "population: " +
            d.population +
            "<br> aged 65 and older: " +
            d.aged_65_older
        );
    };

    const moveTooltip = function (event, d) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px")
        .html(
          d.location +
            "<br><span>" +
            "Total cases:  " +
            parseInt(d.total_cases) +
            "<br><span>" +
            "population: " +
            d.population +
            "<br> aged 65 and older: " +
            d.aged_65_older
        );
    };

    const doNotHighlight = function () {
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", (d) => color(d.region))
        .attr("r", 3);
    };

    const hideTooltip = function () {
      tooltip.style("visibility", "hidden");
    };

    const colorPalette = [
      "#a30b71",
      "#8FBFCC",
      "#26265c",
      "#ffd20a",
      "#008080",
      "#FF1D33",
      "#226D7B",
      "#002E6B",
    ];
    const color = d3
      .scaleOrdinal()
      .domain(totalRegionalIndicator)
      .range(colorPalette);

    const n = totalRegionalIndicator.length / 2;
    const itemWidth = 150;
    const itemHeight = 25;
    const legend = legendSvg
      .selectAll(".legend")
      .data(totalRegionalIndicator)
      .enter()
      .append("g")
      .attr("transform", (d, i) => "translate(0," + i * itemHeight + ")")
      .attr("class", "legend");

    const rects = legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d, i) => color(d.region))
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight);

    const text = legend
      .append("text")
      .attr("dy", 0)
      .attr("x", 20)
      .attr("y", 12)
      .style("fill", (d) => color(d.region))
      .text((d) => d.value)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight);

    let xVariable = "aged_65_older";
    let yVariable = "total_cases_share";

    drawGraph(xVariable, yVariable);

    function drawGraph(xVar, yVar) {
      const svg = d3
        .select("#chart4")
        .append("svg")
        .attr("width", width4 + margin4.left + margin4.right)
        .attr("height", height4 + margin4.top + margin4.bottom)
        .attr("id", "scatter_graph")
        .append("g")
        .attr(
          "transform",
          "translate(" + margin4.left + "," + margin4.top + ")"
        );

      const xScale = d3
        .scaleLinear()
        .domain([0, getMinMaxValue(xVar)[1]])
        .range([0, width4]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height4 + ")")
        .call(d3.axisBottom(xScale));

      const yScale = d3
        .scaleLinear()
        .domain([0, getMinMaxValue(yVar)[1]])
        .range([height4, 0]);
      svg.append("g").call(d3.axisLeft(yScale));

      svg
        .selectAll(".tick text")
        .style("font-size", "12px")
        .attr("fill", "#8E8883");
      svg.selectAll(".tick line").attr("stroke", "#C0C0BB");
      svg.selectAll(".domain").attr("stroke", "#C0C0BB");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width4 / 2)
        .attr("y", height4 + margin4.bottom - 20)
        .attr("fill", "#635F5D")
        .text("Population of 65 years and above (% of total)");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height4 + 20)
        .attr("fill", "#635F5D")
        .text("COVID Confirmed Cases (% of total population)");

      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", (d) => "dot " + d.region)
        .attr("cx", (d) => xScale(+d[xVar]))
        .attr("cy", (d) => yScale(+d[yVar]))
        .attr("r", 4)
        .style("fill", (d) => color(d.region))
        .on("mouseover", showTooltip)
        .on("mouseleave", moveTooltip)
        .on("mouseout", hideTooltip);
    }
  })
  .catch((err) => {
    console.error(err);
  });
