import Rx from 'rx'
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

export const intentSubject = new Rx.Subject();

export const addEdge = (u, v, d) => {
  intentSubject.onNext({
    type: GRAPH_ADD_EDGE,
    u,
    v,
    d,
  });
};

export const addVertex = (u, d) => {
  intentSubject.onNext({
    type: GRAPH_ADD_VERTEX,
    u,
    d,
  });
};

export const addVertexToLower = (u, v, vd, d) => {
  intentSubject.onNext({
    type: GRAPH_ADD_VERTEX_TO_LOWER,
    u,
    v,
    vd,
    d,
  });
};

export const addVertexToUpper = (u, v, ud, d) => {
  intentSubject.onNext({
    type: GRAPH_ADD_VERTEX_TO_UPPER,
    u,
    v,
    ud,
    d,
  });
};

export const clear = () => {
  intentSubject.onNext({
    type: GRAPH_CLEAR,
  });
};

export const load = (data) => {
  intentSubject.onNext({
    type: GRAPH_LOAD,
    data,
  });
};

export const redo = () => {
  intentSubject.onNext({
    type: GRAPH_REDO,
  });
};

export const removeEdge = (u, v) => {
  intentSubject.onNext({
    type: GRAPH_REMOVE_EDGE,
    u,
    v,
  });
};

export const removeVertex = (u) => {
  intentSubject.onNext({
    type: GRAPH_REMOVE_VERTEX,
    u,
  });
};

export const undo = () => {
  intentSubject.onNext({
    type: GRAPH_UNDO,
  });
};
