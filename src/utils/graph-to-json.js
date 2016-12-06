export const graphToJson = (graph) => {
  return {
    vertices: graph.vertices().map((u) => {
      const d = graph.vertex(u)
      return {
        u,
        d: {
          text: d.text,
          participants: d.participants,
          parent: d.parent
        }
      }
    }),
    edges: graph.edges().map(([u, v]) => {
      const d = graph.edge(u, v)
      return {
        u,
        v,
        d: {
          participants: d.participants
        }
      }
    })
  }
}
