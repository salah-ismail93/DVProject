var domain = [0, 10, 30, 50, 80, 100];

// Load external data and boot
var data = new Map();
//
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const d = new Date();

// Time
var dataTime = d3.range(0, 36, 3).map(function (d) {
  var year_add = Math.floor(d / 12);
  var month = d % 12;
  return new Date(2020 + year_add, month, 1);
});

var sliderTime = d3
  .sliderHorizontal()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(60 * 60 * 24 * 365)
  .width(700)
  .tickFormat(d3.timeFormat('%b %Y'))
  .tickValues(dataTime)
  .on('onchange', function (val) {
    changeCSVData(d3.timeFormat('%Y')(val), d3.timeFormat('%m')(val));
    d3.select('p#value-time').text(d3.timeFormat('%b %Y')(val));
  });

var gTime = d3
  .select('div#slider-time')
  .append('svg')
  .attr('width', 800)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%b %Y')(sliderTime.value()));

changeCSVData(2020, 1);

function changeCSVData(year, month) {
  Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("/data/map_data_str.csv")
  ]).then(([topo, args]) => {
    changeData(null, topo, args, year, parseInt(month.toString()));
  }).catch(error => {
    console.error("Error loading data:", error);
  });
}

function changeData(error, topo, args, yearValue, month) {
  if (yearValue == null) {
    yearValue = 2020;
  }
  if (document.getElementsByClassName("legendEntry")) {
    const elements = document.getElementsByClassName("legendEntry");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  args = args.filter(d => d.year == yearValue);
  args = args.filter(d => d.month == month);
  args.forEach(d => data.set(d.location, parseInt(d.stringency_index)));

  var svg = d3.select("svg#chart5"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var path = d3.geoPath();
  var projection = d3.geoMercator()
  .scale(width / 2.5)                       // This is like the zoom
  .center([100, 23])                // GPS of location to zoom on
  .translate([width / 2, height / 2]);

  var pinkColors = ["#ffd7cf", "#ffbfb2", "#ffa696", "#ff8d7c", "#ff7162", "#ff504a", "#ff1d33"];
  var colorScale = d3.scaleThreshold()
    .domain(domain)
    .range(pinkColors);

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("box-shadow", "0px 3px 9px rgba(0, 0, 0, .15)")
    .style("padding", "5px");

  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    .attr("stroke", "white")
    .attr("stroke-width", "0.8px")
    .attr("d", path.projection(projection))
    .attr("fill", function (d) {
      d.count = data.get(d.properties.name) || 0;
      return colorScale(d.count);
    })
    .on("mouseover", function () { return tooltip.style("visibility", "visible"); })
    .on("mousemove", function (d) {
      return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px")
        .html((d.properties.name) + "<br><span> Stringency Index: " + (d.count));
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });

  var legend = svg.selectAll('rect')
    .data(domain)
    .join('g').attr('class', 'legendEntry');

  legend
    .append('rect')
    .attr("x", width - 115)
    .attr("y", function (d, i) {
      return i * 20 + 250;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", function (d) {
      return colorScale(d);
    });

  legend
    .append('text')
    .attr("x", width - 100)
    .attr("y", function (d, i) {
      return i * 20 + 250;
    })
    .attr("dy", "0.7em")
    .text(function (d, i) {
      return readablize(domain[i]) + (domain[i + 1] ? ("-" + readablize(domain[i + 1])) : "");
    });
}

function readablize(number) {
  var s = ['', 'K', 'M', 'GB', 'TB', 'PB'];
  if (number > 999) {
    var e = Math.floor(Math.log(number) / Math.log(1000));
    return (number / Math.pow(1000, e)) + " " + s[e];
  } else {
    return number;
  }
}
