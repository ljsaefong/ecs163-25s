export function drawStreamGraph(rawData, colorScale) {
  const frequencyScale = {
    "Never": 0,
    "Rarely": 1,
    "Sometimes": 2,
    "Very frequently": 3
  };

  //get genre freq
  const frequencyCols = rawData.columns.filter(d => d.startsWith("Frequency ["));
  const genres = frequencyCols.map(col => col.replace("Frequency [", "").replace("]", ""));

  //make to number for stream
  const genreData = genres.map((genre, i) => {
    const col = frequencyCols[i];
    const values = rawData.map(d => frequencyScale[d[col]] ?? 0);
    return { genre, values };
  });

  //stack it
  const streamData = rawData.map((_, idx) => {
    const obj = { index: idx };
    genreData.forEach(g => obj[g.genre] = g.values[idx]);
    return obj;
  });

  const svg = d3.select("#streamgraph"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        margin = { top: 40, right: 30, bottom: -10, left: 50 };

  const keys = genres;

  //layout
  const stack = d3.stack()
    .keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);

  const series = stack(streamData);

  //scale both
  const x = d3.scaleLinear()
    .domain([0, streamData.length - 1])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([
      d3.min(series, s => d3.min(s, d => d[0])),
      d3.max(series, s => d3.max(s, d => d[1]))
    ])
    .range([height - margin.bottom, margin.top]);

  const color = colorScale;
  const area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  //make the layers
  svg.selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", d => color(d.key))
    .attr("d", area)
    .append("title")
    .text(d => d.key);

  //label x axis 
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(10))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Respondent Index");

  //label y axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .append("text")
    .attr("x", -40)
    .attr("y", 25)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .text("Listening Frequency");

}
