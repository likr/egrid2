import Graph from 'egraph/lib/graph'

const filterGraphByParticipant = (g, participantId) => {
  const graph = new Graph();
  for (const u of g.vertices()) {
    const d = g.vertex(u);
    if (d.participants.indexOf(participantId) > -1) {
      graph.addVertex(u, Object.assign({}, d));
    }
  }
  for (const [u, v] of g.edges()) {
    const d = g.edge(u, v);
    if (d.participants.indexOf(participantId) > -1) {
      graph.addEdge(u, v, Object.assign({}, d));
    }
  }
  return graph;
};

export default filterGraphByParticipant
