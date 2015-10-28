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
