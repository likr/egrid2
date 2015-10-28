/* global document */

import Layouter from 'egraph/lib/layouter/sugiyama';

const measureText = (texts) => {
  const bodyElement = document.getElementsByTagName('body')[0],
        svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text'),
        result = [];
  textElement.setAttribute('font-size', '14');
  svgElement.appendChild(textElement);
  bodyElement.appendChild(svgElement);

  for (const text of texts) {
    textElement.textContent = text;
    const {width, height} = textElement.getBBox();
    result.push({width, height});
  }

  bodyElement.removeChild(svgElement);
  return result;
};

const layouter = new Layouter()
  .layerMargin(140)
  .vertexWidth(({d}) => d.width)
  .vertexHeight(({d}) => d.height)
  .vertexMargin(30)
  .edgeWidth(() => 3)
  .edgeMargin(5);

const calcSizes = (graph) => {
  const sizes = measureText(graph.vertices().map((u) => graph.vertex(u).text)),
        result = {};
  graph.vertices().forEach((u, i) => {
    result[u] = sizes[i];
  });
  return result;
};

const layout = (graph) => {
  const sizes = calcSizes(graph);
  for (const u of graph.vertices()) {
    Object.assign(graph.vertex(u), sizes[u]);
  }

  const positions = layouter.layout(graph);

  const vertices = [];
  for (const u of graph.vertices()) {
    const d = graph.vertex(u);
    const {text, selected, community} = d;
    const {x, y, width, height} = positions.vertices[u];
    const textWidth = sizes[u].width;
    const textHeight = sizes[u].height;
    const x0 = d.x === null ? x : d.x;
    const y0 = d.y === null ? 0 : d.y;
    vertices.push({
      u, selected, x, y, x0, y0, width, height,
      textWidth, textHeight, community, text,
      rightMargin: d.width
    });
  }

  const enterPoints = (u, v) => {
    const uD = graph.vertex(u),
      vD = graph.vertex(v),
      ux0 = uD.x === null ? positions.vertices[u].x : uD.x,
      uy0 = uD.y === null ? 0 : uD.y,
      vx0 = vD.x === null ? positions.vertices[v].x : vD.x,
      vy0 = vD.y === null ? 0 : vD.y;
    return [[ux0, uy0], [ux0, uy0], [vx0, vy0], [vx0, vy0], [vx0, vy0], [vx0, vy0]];
  };
  const edges = [];
  for (const [u, v] of graph.edges()) {
    const d = graph.edge(u, v);
    const {upper, lower} = d;
    const {points, reversed} = positions.edges[u][v];
    while (points.length < 6) {
      points.push(points[points.length - 1]);
    }
    const points0 = d.points === null ? enterPoints(u, v) : d.points;
    edges.push({u, v, points, points0, reversed, upper, lower});
  }

  for (const u of graph.vertices()) {
    const {x, y} = positions.vertices[u];
    Object.assign(graph.vertex(u), {x, y});
  }
  for (const [u, v] of graph.edges()) {
    const {points} = positions.edges[u][v];
    Object.assign(graph.edge(u, v), {points});
  }

  return {vertices, edges};
};

export default layout
