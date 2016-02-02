/* eslint-env worker */

import Graph from 'egraph/lib/graph'
import Layouter from 'egraph/lib/layouter/sugiyama'

const calcSize = (vertices) => {
  const left = Math.min(0, ...vertices.map(({x, width}) => x - width / 2));
  const right = Math.max(0, ...vertices.map(({x, width}) => x + width / 2));
  const top = Math.min(0, ...vertices.map(({y, height}) => y - height / 2));
  const bottom = Math.max(0, ...vertices.map(({y, height}) => y + height / 2));
  return {
    width: right - left,
    height: bottom - top,
  };
};

const layout = (graph, {layerMargin, vertexMargin, edgeMargin}) => {
  const layouter = new Layouter()
    .layerMargin(layerMargin)
    .vertexWidth(({d}) => d.width * d.scale)
    .vertexHeight(({d}) => d.height * d.scale)
    .vertexMargin(vertexMargin)
    .edgeWidth(({d}) => d.width * d.scale)
    .edgeMargin(edgeMargin);
  const positions = layouter.layout(graph);

  const vertices = [];
  for (const u of graph.vertices()) {
    const d = graph.vertex(u);
    const {text, width, height, scale} = d;
    const {x, y} = positions.vertices[u];
    vertices.push({u, x, y, width, height, scale, text});
  }

  const edges = [];
  for (const [u, v] of graph.edges()) {
    const {points, width, reversed} = positions.edges[u][v];
    while (points.length < 6) {
      points.push(points[points.length - 1]);
    }
    edges.push({u, v, points, reversed, width});
  }

  return Object.assign({vertices, edges}, calcSize(vertices));
};

onmessage = ({data}) => {
  const graph = new Graph();
  for (const {u, d} of data.vertices) {
    graph.addVertex(u, d);
  }
  for (const {u, v, d} of data.edges) {
    graph.addEdge(u, v, d);
  }
  postMessage(layout(graph, data.options));
};
