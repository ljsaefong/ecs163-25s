import { drawStreamGraph } from './visuals/streamgraph.js';
import { drawGenreBar } from './visuals/genrebar.js';
import { drawScatterPlot } from './visuals/histogram.js';

let globalData, colorScale;

d3.csv("data/mxmh_survey_results.csv").then(data => {
  globalData = data;

  const genres = [...new Set(data.map(d => d["Fav genre"]))].filter(Boolean);
  colorScale = d3.scaleOrdinal()
    .domain(genres)
    .range([
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
      "#fdae61", "#80cdc1", "#bf812d", "#c51b7d", "#1b9e77",
      "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00",
      "#a65628", "#f781bf", "#999999", "#66c2a5", "#fc8d62",
      "#a6d854", "#ffd92f", "#e78ac3", "#b3b3b3", "#bebada"
    ]);

  drawAllViews(data);

  drawStreamGraph(data, colorScale, brushedData => {
    drawAllViews(brushedData, true);
  });

  drawSharedLegend(genres, colorScale);
});

function drawAllViews(data, animated = false) {
  drawScatterPlot(data, colorScale, animated);
  drawGenreBar(data, colorScale, animated);
}

function drawSharedLegend(genres, colorScale) {
  const container = d3.select("#genre-legend");
  container.selectAll("*").remove();

  const legend = container.append("div")
    .attr("class", "legend-grid");

  genres.forEach(genre => {
    const item = legend.append("div").attr("class", "legend-item");
    item.append("span")
      .attr("class", "legend-color")
      .style("background-color", colorScale(genre));
    item.append("span")
      .attr("class", "legend-label")
      .text(genre);
  });
}
