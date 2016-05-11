import Rx from 'rx'
import Graph from 'egraph/lib/graph'
import copy from '../utils/copy-graph'
import { GRAPH_ADD_EDGE, GRAPH_ADD_VERTEX, GRAPH_CLEAR, GRAPH_LOAD, GRAPH_REDO, GRAPH_REMOVE_EDGE, GRAPH_REMOVE_VERTEX, GRAPH_UNDO, GRAPH_UPDATE_EDGE, GRAPH_UPDATE_VERTEX,
} from '../constants'
import { intentSubject } from '../intents/graph'

const subject = new Rx.Subject()

let graph = new Graph()
let undoStack = []
let redoStack = []

const next = (type) => {
  subject.onNext({
    type,
    graph,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  })
}

const addVertex = (u, d) => {
  undoStack.push(graph)
  redoStack = []
  graph = copy(graph)
  graph.addVertex(u, d)
  next(GRAPH_ADD_VERTEX)
}

const clear = () => {
  graph = new Graph()
  undoStack = []
  redoStack = []
  next(GRAPH_CLEAR)
}

const load = (data) => {
  graph = new Graph()
  undoStack = []
  redoStack = []
  for (const {u, d} of data.vertices) {
    graph.addVertex(u, d)
  }
  for (const {u, v, d} of data.edges) {
    graph.addEdge(u, v, d)
  }
  next(GRAPH_LOAD)
}

const removeVertex = ({u}) => {
  undoStack.push(graph)
  redoStack = []
  graph = copy(graph)
  graph.removeVertex(u)
  next(GRAPH_REMOVE_VERTEX)
}

const undo = () => {
  if (undoStack.length > 0) {
    redoStack.push(graph)
    graph = undoStack.pop()
    next(GRAPH_UNDO)
  }
}

const redo = () => {
  if (redoStack.length > 0) {
    undoStack.push(graph)
    graph = redoStack.pop()
    next(GRAPH_REDO)
  }
}

const updateEdge = ({u, v, ud, vd, d}) => {
  undoStack.push(graph)
  redoStack = []
  graph = copy(graph)

  const vertexU = graph.vertex(u)
  if (vertexU) {
    Object.assign(vertexU, ud)
  } else {
    graph.addVertex(u, ud)
  }

  const vertexV = graph.vertex(v)
  if (vertexV) {
    Object.assign(vertexV, vd)
  } else {
    graph.addVertex(v, vd)
  }

  const edge = graph.edge(u, v)
  if (edge) {
    Object.assign(edge, d)
  } else {
    graph.addEdge(u, v, d)
  }

  next(GRAPH_UPDATE_EDGE)
}

const updateVertex = ({u, d}) => {
  undoStack.push(graph)
  redoStack = []
  graph = copy(graph)

  const vertex = graph.vertex(u)
  if (vertex) {
    Object.assign(vertex, d)
  } else {
    graph.addVertex(u, d)
  }

  next(GRAPH_UPDATE_VERTEX)
}

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case GRAPH_ADD_EDGE:
    case GRAPH_ADD_VERTEX:
      addVertex(payload.u, payload.d)
      break
    case GRAPH_CLEAR:
      clear()
      break
    case GRAPH_LOAD:
      load(payload.data)
      break
    case GRAPH_REDO:
      redo()
      break
    case GRAPH_REMOVE_EDGE:
    case GRAPH_REMOVE_VERTEX:
      removeVertex(payload)
      break
    case GRAPH_UNDO:
      undo()
      break
    case GRAPH_UPDATE_EDGE:
      updateEdge(payload)
      break
    case GRAPH_UPDATE_VERTEX:
      updateVertex(payload)
      break
  }
})

export default subject.share()
