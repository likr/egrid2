import Rx from 'rx'
import Graph from 'egraph/lib/graph';
import katz from 'egraph/lib/network/centrality/katz';
import CoarseGrainingTransformer from 'egraph/lib/transformer/coarse-graining';
import {
  ANALYSIS_INIT,
  ANALYSIS_SET_THRESHOLD,
  ANALYSIS_UPDATE_PARTICIPANTS,
  ANALYSIS_UPDATE_WORDS,
} from '../constants'
import {intentSubject} from '../intents/analysis'

const subject = new Rx.Subject();

const state = {
  graph: {
    vertices: [],
    edges: [],
  },
  participants: {},
  words: {},
  threshold: 0.3,
};

const originalData = {
  vertices: [],
  edges: [],
};

const next = (type) => {
  const participantIds = new Set(Object.values(state.participants)
    .filter(({checked}) => checked)
    .map(({participant}) => participant.id));
  const graph = new Graph();
  for (const {u, d} of originalData.vertices) {
    if (d.participants.some((id) => participantIds.has(id))) {
      graph.addVertex(u, d);
    }
  }
  for (const {u, v, d} of originalData.edges) {
    if (d.participants.some((id) => participantIds.has(id))) {
      graph.addEdge(u, v, d);
    }
  }
  const centralities = katz(graph);
  const vertices = graph.vertices();
  vertices.sort((u, v) => centralities[u] - centralities[v]);
  for (const u of vertices) {
    graph.vertex(u).centrality = centralities[u];
  }
  const priority = {};
  priority[vertices[0]] = 0;
  for (let i = 1; i < vertices.length; ++i) {
    if (centralities[vertices[i]] > centralities[vertices[i - 1]]) {
      priority[vertices[i]] = i + 1;
    } else {
      priority[vertices[i]] = priority[vertices[i - 1]];
    }
  }
  const transformer = new CoarseGrainingTransformer()
    .vertexVisibility(({u}) => priority[u] >= (1 - state.threshold) * vertices.length);
  const cgGraph = transformer.transform(graph);
  state.graph.vertices = cgGraph.vertices().map((u) => ({u, d: cgGraph.vertex(u)}));
  state.graph.edges = cgGraph.edges().map(([u, v]) => ({u, v, d: cgGraph.edge(u, v)}));
  subject.onNext({type, state});
};

const init = ({graph, participants}) => {
  Object.assign(originalData, graph);
  Object.assign(state.graph, graph);
  state.participants = {};
  for (const participant of participants) {
    state.participants[participant.id] = {
      participant,
      checked: true,
    };
  }
  state.threshold = 0.3;
  next(ANALYSIS_INIT);
};

const setThreshold = ({threshold}) => {
  state.threshold = threshold;
  next(ANALYSIS_SET_THRESHOLD);
};

const updateParticipants = ({participants}) => {
  for (const id in state.participants) {
    if (participants[id] === true) {
      state.participants[id].checked = true;
    } else if (participants[id] === false) {
      state.participants[id].checked = false;
    }
  }
  next(ANALYSIS_UPDATE_PARTICIPANTS);
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case ANALYSIS_INIT:
      init(payload);
      break;
    case ANALYSIS_SET_THRESHOLD:
      setThreshold(payload);
      break;
    case ANALYSIS_UPDATE_PARTICIPANTS:
      updateParticipants(payload);
      break;
    case ANALYSIS_UPDATE_WORDS:
      break;
  }
});

export default subject
