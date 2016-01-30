import Rx from 'rx'
import Graph from 'egraph/lib/graph'
import copy from 'egraph/lib/graph/copy'
import {
  GRAPH_ADD_EDGE,
  GRAPH_ADD_VERTEX,
  GRAPH_ADD_VERTEX_TO_LOWER,
  GRAPH_ADD_VERTEX_TO_UPPER,
  GRAPH_CLEAR,
  GRAPH_LOAD,
  GRAPH_REDO,
  GRAPH_REMOVE_EDGE,
  GRAPH_REMOVE_VERTEX,
  GRAPH_UNDO,
} from '../constants'
import {intentSubject} from '../intents/graph'

const subject = new Rx.Subject();

let graph = new Graph();
let undoStack = [];
let redoStack = [];

const next = (type) => {
  subject.onNext({
    type,
    graph,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  });
};

const addVertex = (u, d) => {
  undoStack.push(graph);
  graph = copy(graph);
  graph.addVertex(u, d);
  next(GRAPH_ADD_VERTEX);
};

const addVertexToLower = (u, v, vd, d) => {
  undoStack.push(graph);
  graph = copy(graph);
  graph.addVertex(v, vd);
  graph.addEdge(u, v, d);
  next(GRAPH_ADD_VERTEX_TO_LOWER);
};

const addVertexToUpper = (u, v, ud, d) => {
  undoStack.push(graph);
  graph = copy(graph);
  graph.addVertex(u, ud);
  graph.addEdge(u, v, d);
  next(GRAPH_ADD_VERTEX_TO_LOWER);
};

const clear = () => {
  graph = new Graph();
  undoStack = [];
  redoStack = [];
  next(GRAPH_CLEAR);
};

const load = (data) => {
  graph = new Graph();
  undoStack = [];
  redoStack = [];
  for (const {u, d} of data.vertices) {
    graph.addVertex(u, d);
  }
  for (const {u, v, d} of data.edges) {
    graph.addEdge(u, v, d);
  }
  next(GRAPH_LOAD);
};

const undo = () => {
  if (undoStack.length > 0) {
    redoStack.push(graph);
    graph = undoStack.pop();
    next(GRAPH_UNDO);
  }
};

const redo = () => {
  if (redoStack.length > 0) {
    undoStack.push(graph);
    graph = redoStack.pop();
    next(GRAPH_REDO);
  }
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case GRAPH_ADD_EDGE:
    case GRAPH_ADD_VERTEX:
      addVertex(payload.u, payload.d);
      break;
    case GRAPH_ADD_VERTEX_TO_LOWER:
      addVertexToLower(payload.u, payload.v, payload.vd, payload.d);
      break;
    case GRAPH_ADD_VERTEX_TO_UPPER:
      addVertexToUpper(payload.u, payload.v, payload.ud, payload.d);
      break;
    case GRAPH_CLEAR:
      clear();
      break;
    case GRAPH_LOAD:
      load(payload.data);
      break;
    case GRAPH_REDO:
      redo();
      break;
    case GRAPH_REMOVE_EDGE:
    case GRAPH_REMOVE_VERTEX:
    case GRAPH_UNDO:
      undo();
      break;
  }
});

export default subject
