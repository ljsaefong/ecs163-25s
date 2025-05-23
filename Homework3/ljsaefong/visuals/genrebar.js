// changed for grouped bar chart showing users favorite genres and split by streaming service they mainly use
export function drawGenreBar(data, colorScale, animated = false) {
  const svg = d3.select("#bar");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  //cleaning
  svg.selectAll("*").remove();

  const margin = { top: 40, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  //change grouping the data by [streaming service][favorite genre] to count for easier viewing
  const grouped = d3.rollups(
    data,
    v => v.length,
    d => d["Primary streaming service"],
    d => d["Fav genre"]
  );

  //get all unique services and genres from the dataset
  const services = Array.from(new Set(data.map(d => d["Primary streaming service"]))).filter(Boolean);
  const genres = Array.from(new Set(data.map(d => d["Fav genre"]))).filter(Boolean);

  //switch nest structure into flat table for service to genre: count
  const stackedData = [];
  grouped.forEach(([service, genreCounts]) => {
    const row = { service };
    genres.forEach(genre => {
      const match = genreCounts.find(([g]) => g === genre);
      row[genre] = match ? match[1] : 0;
    });
    stackedData.push(row);
  });

  //scale for service group positioning
  const x0 = d3.scaleBand()
    .domain(services)
    .range([0, innerWidth])
    .padding(0.2);

  //scale for genre bars within each service group
  const x1 = d3.scaleBand()
    .domain(genres)
    .range([0, x0.bandwidth()])
    .padding(0.05);

  //need to scale for max number of users with genre pref
  const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(genres, g => d[g]))])
    .nice()
    .range([innerHeight, 0]);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //labels for yaxis
  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -30)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Count");

  // xaxis for service
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");

  //draw bars for service
  const bars = g.selectAll("g.bar-group")
    .data(stackedData)
    .join("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(${x0(d.service)},0)`);

  //bar for each gorup
  bars.selectAll("rect")
    .data(d => genres.map(genre => ({ genre, value: d[genre] || 0 })))
    .join("rect")
    .attr("x", d => x1(d.genre))
    .attr("width", x1.bandwidth())
    .transition().duration(animated ? 800 : 0)
    .attr("y", d => y(d.value))
    .attr("height", d => innerHeight - y(d.value))
    .attr("fill", d => colorScale(d.genre));
}
