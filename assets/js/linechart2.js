// Constants
const width3 = 700;
const height3 = 400;
const margin3 = 5;
const padding3 = 5;
const adj3 = 50;

// Initial data update
updateData(5);

//-----------------------------DATA-----------------------------//
function updateData(viewOption) {
  // Remove existing graph lines
  const graphLines = document.getElementsByClassName("graph-line");
  while (graphLines.length > 0) {
    graphLines[0].parentNode.removeChild(graphLines[0]);
  }

  // Append SVG
  const svg = d3
    .select("#chart3")
    .append("svg")
    .attr("class", "graph-line")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr(
      "viewBox",
      `-${adj3} -${adj3} ${width3 + adj3 * 5} ${height3 + adj3 * 2}`
    )
    .style("padding", padding3)
    .style("margin", margin3)
    .classed("svg-content", true);

  let max, datasetLink;
  max = 60;
  datasetLink = "../DVProject/data/line_data.csv";

  // Data loading and processing
  const timeConv = d3.timeParse("%Y-%m-%d");
  const formatDecimal = d3.format(",.4f");
  const dataset = d3.csv(datasetLink);
  dataset.then(function (data) {
    const slices = data.columns.slice(1).map(function (id) {
      return {
        id: id,
        values: data.map(function (d) {
          return {
            date: timeConv(d.date),
            measurement: formatDecimal(+d[id]),
          };
        }),
      };
    });

    // Log data information
    console.log(data);
    console.log("Column headers", data.columns);
    console.log("Column headers without date", data.columns.slice(1));
    console.log("Slices", slices);
    console.log("First slice", slices[0]);
    console.log("A array", slices[0].values);
    console.log("Date element", slices[0].values[0].date);
    console.log("Array length", slices[0].values.length);

    //-----------------------------SCALES-----------------------------//
    const xScale = d3.scaleTime().range([0, width3]);
    const yScale = d3.scaleLinear().rangeRound([height3, 0]);

    xScale.domain(
      d3.extent(data, function (d) {
        return timeConv(d.date);
      })
    );

    yScale.domain([0, max]);

    console.log([
      0,
      d3.max(slices, function (c) {
        return d3.max(c.values, function (d) {
          return d.measurement + 4;
        });
      }),
    ]);

    //-----------------------------AXES-----------------------------//
    const yaxis = d3.axisLeft().ticks(10).scale(yScale);

    const xaxis = d3
      .axisBottom()
      .ticks(d3.timeMonth.every(3))
      .tickFormat(d3.timeFormat("%b %Y"))
      .scale(xScale);

    //-----------------------------LINES----------------------------//
    const line = d3
      .line()
      .x(function (d) {
        return xScale(d.date);
      })
      .y(function (d) {
        return yScale(d.measurement);
      });

    let lineId = 0;
    const generateLineId = function () {
      return "line-" + lineId++;
    };

    //---------------------------TOOLTIP----------------------------//
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute");

    //-------------------------2. DRAWING---------------------------//
    //-----------------------------AXES-----------------------------//
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height3})`)
      .call(xaxis);

    svg
      .append("g")
      .attr("class", "axis")
      .call(yaxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", ".75em")
      .attr("y", 6)
      .style("text-anchor", "end")
      .style("font-size", "2em")
      .text("new cases/population(%)");

    //----------------------------LINES-----------------------------//
    const lines = svg.selectAll(".lines").data(slices).enter().append("g");

    lines
      .append("path")
      .attr("class", "line")
      .attr("d", function (d) {
        return line(d.values);
      });

    lines
      .append("text")
      .attr("class", "series-label")
      .datum(function (d) {
        return {
          id: d.id,
          value: d.values[d.values.length - 1],
        };
      })
      .attr("transform", function (d) {
        return `translate(${
          xScale(d.value.date) + 10
        }, ${yScale(d.value.measurement) + 5})`;
      })
      .attr("x", 5)
      .text(function (d) {
        return d.id;
      });

    const ghostLines = lines
      .append("path")
      .attr("class", "ghost-line")
      .style("stroke", "#ed3700")
      .attr("d", function (d) {
        return line(d.values);
      });

    //---------------------------POINTS-----------------------------//
    lines
      .selectAll("points")
      .data(function (d) {
        return d.values;
      })
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.date);
      })
      .attr("cy", function (d) {
        return yScale(d.measurement);
      })
      .attr("r", 1)
      .attr("class", "point")
      .style("opacity", 1);

    //---------------------------EVENTS-----------------------------//
    lines
      .selectAll("circles")
      .data(function (d) {
        return d.values;
      })
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.date);
      })
      .attr("cy", function (d) {
        return yScale(d.measurement);
      })
      .attr("r", 10)
      .style("opacity", 0)
      .on("mouseover", function (event, d) {
        tooltip.transition().delay(30).duration(200).style("opacity", 1);

        tooltip
          .html(d.measurement)
          .style("left", event.pageX + 25 + "px")
          .style("top", event.pageY + "px");

        const selection = d3.select(this).raise();

        selection
          .transition()
          .delay("20")
          .duration("200")
          .attr("r", 6)
          .style("opacity", 1)
          .style("fill", "#FF1D33");
      })

      .on("mouseout", function (e, d) {
        tooltip.transition().duration(100).style("opacity", 0);

        const selection = d3.select(this);

        selection
          .transition()
          .delay("20")
          .duration("200")
          .attr("r", 10)
          .style("opacity", 0);
      });

    svg
      .selectAll(".ghost-line")
      .on("mouseover", function () {
        const selection = d3.select(this).raise();
        selection
          .transition()
          .delay("100")
          .duration("10")
          .style("stroke", "#FF1D33")
          .style("opacity", "1")
          .style("stroke-width", "3");

        const legend = d3.select(this.parentNode).select(".series-label");

        legend
          .transition()
          .delay("100")
          .duration("10")
          .style("fill", "#d10e0c");
      })
      .on("mouseout", function () {
        const selection = d3.select(this);
        selection
          .transition()
          .delay("100")
          .duration("10")
          .style("stroke", "#d2d2d2")
          .style("opacity", "0")
          .style("stroke-width", "10");

        const legend = d3.select(this.parentNode).select(".series-label");
        legend
          .transition()
          .delay("100")
          .duration("10")
          .style("fill", "#D26464");
      });
  });
}
