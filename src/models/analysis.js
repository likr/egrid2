import Rx from 'rx'
import Graph from 'egraph/lib/graph'
import katz from 'egraph/lib/network/centrality/katz'
import CoarseGrainingTransformer from 'egraph/lib/transformer/coarse-graining'
import { ANALYSIS_INIT, ANALYSIS_SELECT_VERTEX, ANALYSIS_SELECT_VERTICES_BY_WORD, ANALYSIS_SET_THRESHOLD, ANALYSIS_UPDATE_PARTICIPANTS,
} from '../constants'
import { intentSubject } from '../intents/analysis'
import { calcLayout } from '../intents/layout-worker'
import { calcMorph } from '../intents/morph-worker'
import LayoutWorker from './layout-worker'

const connectedVertices = (graph, u, inverse = false) => {
  const visited = new Set([u])
  const queue = [u]
  const adjacentVertices = inverse
    ? (v) => graph.inVertices(v)
    : (v) => graph.outVertices(v)
  while (queue.length > 0) {
    const v = queue.shift()
    for (const w of adjacentVertices(v)) {
      if (!visited.has(w)) {
        visited.add(w)
        queue.push(w)
      }
    }
  }
  return visited
}

const subject = new Rx.Subject()

const state = {
  graph: new Graph(),
  graphData: {
    vertices: [],
    edges: [],
  },
  participants: {},
  words: {},
  threshold: 0.3,
  selection: new Set(),
  layout: {
    vertices: [],
    edges: [],
    width: 0,
    height: 0,
  },
}

const originalData = {
  vertices: [],
  edges: [],
}

LayoutWorker.subscribe(({data}) => {
  state.layout = data
  updateSelection(state.graph, state.layout)
  subject.onNext(state)
  calcMorph(data.vertices.map(({d}) => d.text))
})

const updateSelection = (graph, layout) => {
  const vertices = {}
  for (const {u, d} of layout.vertices) {
    vertices[u] = d
    d.selected = false
    d.upper = false
    d.lower = false
  }
  for (const u of state.selection) {
    if (graph.vertex(u)) {
      vertices[u].selected = true
      for (const v of connectedVertices(graph, u, true)) {
        vertices[v].upper = true
      }
      for (const v of connectedVertices(graph, u, false)) {
        vertices[v].lower = true
      }
    }
  }
}

const next = (type) => {
  const participantIds = new Set(Object.values(state.participants)
    .filter(({checked}) => checked)
    .map(({participant}) => participant.id))
  const graph = new Graph()
  for (const {u, d} of originalData.vertices) {
    if (d.participants.some((id) => participantIds.has(id))) {
      graph.addVertex(u, d)
    }
  }
  for (const {u, v, d} of originalData.edges) {
    if (d.participants.some((id) => participantIds.has(id))) {
      graph.addEdge(u, v, d)
    }
  }

  const centralities = katz(graph)
  const vertices = graph.vertices()
  vertices.sort((u, v) => centralities[u] - centralities[v])
  for (const u of vertices) {
    graph.vertex(u).centrality = centralities[u]
  }
  const priority = {}
  priority[vertices[0]] = 0
  for (let i = 1; i < vertices.length; ++i) {
    if (centralities[vertices[i]] > centralities[vertices[i - 1]]) {
      priority[vertices[i]] = i + 1
    } else {
      priority[vertices[i]] = priority[vertices[i - 1]]
    }
  }
  const transformer = new CoarseGrainingTransformer()
    .vertexVisibility(({u}) => priority[u] >= (1 - state.threshold) * vertices.length)
  state.graph = transformer.transform(graph)
  state.graphData.vertices = state.graph.vertices().map((u) => ({u, d: state.graph.vertex(u)}))
  state.graphData.edges = state.graph.edges().map(([u, v]) => ({u, v, d: state.graph.edge(u, v)}))

  switch (type) {
    case ANALYSIS_INIT:
    case ANALYSIS_SET_THRESHOLD:
    case ANALYSIS_UPDATE_PARTICIPANTS:
      const participantIds = new Set(Object.values(state.participants)
        .filter(({checked}) => checked)
        .map(({participant}) => participant.id))
      const participantCount = (d) => {
        return d.participants ? d.participants.filter((id) => participantIds.has(id)).length : 1
      }
      calcLayout(state.graphData, {
        layerMargin: 50,
        vertexMargin: 15,
        edgeMargin: 15,
        vertexScale: ({d}) => Math.sqrt(participantCount(d)),
        edgeScale: ({d}) => participantCount(d),
      })
      break
    default:
      updateSelection(state.graph, state.layout)
      subject.onNext(state)
  }
}

const init = ({graph, participants}) => {
  Object.assign(originalData, graph)
  Object.assign(state.graphData, graph)
  state.participants = {}
  for (const participant of participants) {
    state.participants[participant.id] = {
      participant,
      checked: true,
    }
  }
  state.threshold = 0.3
  next(ANALYSIS_INIT)
}

const selectVertex = ({u}) => {
  if (state.selection.has(u)) {
    state.selection.delete(u)
  } else {
    state.selection.add(u)
  }
  next(ANALYSIS_SELECT_VERTEX)
}

const setThreshold = ({threshold}) => {
  state.threshold = threshold
  next(ANALYSIS_SET_THRESHOLD)
}

const updateParticipants = ({participants}) => {
  for (const id in state.participants) {
    if (participants[id] === true) {
      state.participants[id].checked = true
    } else if (participants[id] === false) {
      state.participants[id].checked = false
    }
  }
  next(ANALYSIS_UPDATE_PARTICIPANTS)
}

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case ANALYSIS_INIT:
      init(payload)
      break
    case ANALYSIS_SELECT_VERTEX:
      selectVertex(payload)
      break
    case ANALYSIS_SELECT_VERTICES_BY_WORD:
      break
    case ANALYSIS_SET_THRESHOLD:
      setThreshold(payload)
      break
    case ANALYSIS_UPDATE_PARTICIPANTS:
      updateParticipants(payload)
      break
  }
})

export default subject
