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
  UPDATE_VERTEX
} from '../action-types'

export const addVertex = (u, d) => {
  return {
    type: ADD_VERTEX,
    u,
    d
  };
}

export const addVertexWithEdge = ({u, v, ud, vd, d}) => {
  return {
    type: ADD_VERTEX_WITH_EDGE,
    u,
    v,
    ud,
    vd,
    d
  };
}

export const clearGraph = () => {
  return {type: CLEAR_GRAPH};
};

export const loadGraph = (data) => {
  return {
    type: LOAD_GRAPH,
    data
  };
};

export const redo = () => {
  return {
    type: REDO_GRAPH
  };
}

export const undo = () => {
  return {
    type: UNDO_GRAPH
  };
}

export const updateVertex = (u, d) => {
  return {
    type: UPDATE_VERTEX,
    u,
    d
  };
};
