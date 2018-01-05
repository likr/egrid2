export const participantGraphJson = (graph, participantId) => {
  return {
    vertices: graph.vertices()
      .map((u) => ({u, d: graph.vertex(u)}))
      .filter(({d}) => d.participants && d.participants.indexOf(participantId) >= 0),
    edges: graph.edges()
      .map(([u, v]) => ({u, v, d: graph.edge(u, v)}))
      .filter(({d}) => d.participants && d.participants.indexOf(participantId) >= 0)
  }
}
