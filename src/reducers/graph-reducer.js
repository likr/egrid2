import Graph from 'egraph/lib/graph'
import copy from 'egraph/lib/graph/copy'
import {
  ADD_EDGE,
  ADD_VERTEX,
  ADD_VERTEX_WITH_EDGE,
  CLEAR_GRAPH,
  DELETE_VERTEX,
  DELETE_EDGE,
  LOAD_GRAPH,
  REDO_GRAPH,
  UNDO_GRAPH,
  UPDATE_EDGE_WITH_VERTICES,
  UPDATE_VERTEX
} from '../action-types'

const updateVertexData = (graph, u, d) => {
  const old = graph.vertex(u);
  if (old === null) {
    graph.addVertex(u, d);
    return;
  }
  const inVertices = graph.inVertices(u).map((v) => [v, graph.edge(v, u)]);
  const outVertices = graph.outVertices(u).map((v) => [v, graph.edge(u, v)]);
  graph.removeVertex(u);
  graph.addVertex(u, Object.assign({}, old, d));
  for (const [v, e] of inVertices) {
    graph.addEdge(v, u, e);
  }
  for (const [v, e] of outVertices) {
    graph.addEdge(u, v, e);
  }
};

const updateEdgeData = (graph, u, v, d) => {
  const old = graph.edge(u, v);
  if (old === null) {
    graph.addEdge(u, v, d);
    return;
  }
  graph.removeEdge(u, v);
  graph.addEdge(u, v, Object.assign({}, old, d));
};

const addEdge = (prev, {u, v, d}) => {
  const graph = copy(prev.graph);
  graph.addEdge(u, v, d);
  return {
    graph,
    prev,
    next: null
  };
};

const addVertex = (prev, {u, d}) => {
  const graph = copy(prev.graph);
  graph.addVertex(u, d);
  return {
    graph,
    prev,
    next: null
  };
};

const addVertexWithEdge = (prev, {u, v, ud, vd, d}) => {
  const graph = copy(prev.graph);
  if (ud) {
    graph.addVertex(u, ud);
  }
  if (vd) {
    graph.addVertex(v, vd);
  }
  graph.addEdge(u, v, d);
  return {
    graph,
    prev,
    next: null
  };
};

const clearGraph = () => {
  const graph = new Graph();
  return {
    graph,
    prev: null,
    next: null
  };
};

const loadGraph = (prev, {data}) => {
  const graph = new Graph();
  for (const {u, d} of data.vertices) {
    graph.addVertex(u, d);
  }
  for (const {u, v, d} of data.edges) {
    graph.addEdge(u, v, d);
  }
  return {
    graph,
    prev: null,
    next: null
  };
};

const undo = (state) => {
  return Object.assign({}, state.prev, {
    next: state
  });
};

const redo = (state) => {
  return state.next
};

const updateEdgeWithVertices = (prev, {u, v, ud, vd, d}) => {
  const graph = copy(prev.graph);
  updateVertexData(graph, u, ud);
  updateVertexData(graph, v, vd);
  updateEdgeData(graph, u, v, d);
  return {
    graph,
    prev,
    next: null
  };
};

const updateVertex = (prev, {u, d}) => {
  const graph = copy(prev.graph);
  updateVertexData(graph, u, d);
  return {
    graph,
    prev,
    next: null
  };
};

const graphReducer = (state=null, action) => {
  if (state === null) {
    state = {
      graph: new Graph(),
      prev: null,
      next: null
    };
  }
  switch (action.type) {
    case ADD_EDGE:
      return addEdge(state, action);
    case ADD_VERTEX:
      return addVertex(state, action);
    case ADD_VERTEX_WITH_EDGE:
      return addVertexWithEdge(state, action);
    case CLEAR_GRAPH:
      return clearGraph();
    case DELETE_VERTEX:
    case DELETE_EDGE:
    case LOAD_GRAPH:
      return loadGraph(state, action);
    case REDO_GRAPH:
      return redo(state);
    case UNDO_GRAPH:
      return undo(state);
    case UPDATE_EDGE_WITH_VERTICES:
      return updateEdgeWithVertices(state, action);
    case UPDATE_VERTEX:
      return updateVertex(state, action);
    default:
      return state;
  }
};

export default graphReducer
