import { drawStreamGraph } from './visuals/streamgraph.js';
import { drawGenreBar } from './visuals/genrebar.js';
import { drawScatterPlot } from './visuals/histogram.js';

d3.csv("data/mxmh_survey_results.csv").then(data => {
  //get genres and assign colors for easier universal viewing 
  const genres = [...new Set(data.map(d => d["Fav genre"]))].filter(Boolean);
  const colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range([
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
      "#fdae61", "#80cdc1", "#bf812d", "#c51b7d", "#1b9e77",
      "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00",
      "#a65628", "#f781bf", "#999999", "#66c2a5", "#fc8d62",
      "#a6d854", "#ffd92f", "#e78ac3", "#b3b3b3", "#bebada"
    ]);

  //charts
  drawStreamGraph(data, colorScale);
  drawScatterPlot(data, colorScale);
  drawGenreBar(data, colorScale);
  drawSharedLegend(genres, colorScale);
});

function drawSharedLegend(genres, colorScale) {
  const container = d3.select("#genre-legend");
  container.selectAll("*").remove();

  const itemsPerRow = 4;
  const itemWidth = 150;

  const legend = container.append("div")
    .attr("class", "legend-grid");

  genres.forEach((genre, i) => {
    const item = legend.append("div")
      .attr("class", "legend-item");

    item.append("span")
      .attr("class", "legend-color")
      .style("background-color", colorScale(genre));

    item.append("span")
      .attr("class", "legend-label")
      .text(genre);
  });
}
