import Graph from 'egraph/graph'

const copy = (g) => {
  const newGraph = new Graph()
  for (const u of g.vertices()) {
    newGraph.addVertex(u, Object.assign({}, g.vertex(u)))
  }
  for (const [u, v] of g.edges()) {
    newGraph.addEdge(u, v, Object.assign({}, g.edge(u, v)))
  }
  return newGraph
}

export default copy
