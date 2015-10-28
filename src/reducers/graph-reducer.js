import Graph from 'egraph/lib/graph'
import copy from 'egraph/lib/graph/copy'
import {
  ADD_EDGE,
  ADD_VERTEX,
  ADD_VERTEX_WITH_EDGE,
  DELETE_VERTEX,
  DELETE_EDGE,
  LOAD_GRAPH,
  REDO_GRAPH,
  UNDO_GRAPH
} from '../action-types'

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

const undo = (state) => {
  return Object.assign({}, state.prev, {
    next: state
  });
};

const redo = (state) => {
  return state.next
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
    case DELETE_VERTEX:
    case DELETE_EDGE:
    case LOAD_GRAPH:
    case REDO_GRAPH:
      return redo(state);
    case UNDO_GRAPH:
      return undo(state);
    default:
      return state;
  }
};

export default graphReducer
