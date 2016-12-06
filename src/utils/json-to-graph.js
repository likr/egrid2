import Graph from 'egraph/graph'

export const jsonToGraph = (data) => {
  const graph = new Graph()
  for (const {u, d} of data.vertices) {
    graph.addVertex(u, d)
  }
  for (const {u, v, d} of data.edges) {
    graph.addEdge(u, v, d)
  }
  return graph
}
