export function drawScatterPlot(data, colorScale) {
  const svg = d3.select("#scatterplot");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  svg.selectAll("*").remove(); //make sure it's clear

  //average sizing
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //detect keys
  const hoursKey = Object.keys(data[0]).find(k =>
    k.toLowerCase().includes("hours per day")
  );
  const depressionKey = "Depression";

  //parse my data
  const points = data.filter(d =>
    !isNaN(parseFloat(d[hoursKey])) &&
    !isNaN(parseFloat(d[depressionKey])) &&
    d["Fav genre"]
  );

  //scale for fitting
  const x = d3.scaleLinear()
    .domain(d3.extent(points, d => +d[hoursKey])).nice()
    .range([0, innerWidth]);
  const y = d3.scaleLinear()
    .domain(d3.extent(points, d => +d[depressionKey])).nice()
    .range([innerHeight, 0]);

  //my x axis
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .text("Hours Listening per Day");
  //my y axis
  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -20)
    .attr("y", -40)
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .text("Depression Level");

  //put in my points
  g.selectAll("circle")
    .data(points)
    .join("circle")
    .attr("cx", d => x(+d[hoursKey]))
    .attr("cy", d => y(+d[depressionKey]))
    .attr("r", 4)
    .attr("fill", d => colorScale(d["Fav genre"]))
    .attr("font-weight", "bold")
    .attr("opacity", 0.7);

  //title
  svg.append("text")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("font-weight", "bold")
}
