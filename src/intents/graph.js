import {Subject} from 'rxjs'
import {
  GRAPH_ADD_EDGE,
  GRAPH_ADD_VERTEX,
  GRAPH_CLEAR,
  GRAPH_LOAD,
  GRAPH_REDO,
  GRAPH_REMOVE_EDGE,
  GRAPH_REMOVE_VERTEX,
  GRAPH_UNDO,
  GRAPH_UPDATE_EDGE,
  GRAPH_UPDATE_VERTEX
} from '../constants'

export const intentSubject = new Subject()

export const addEdge = (u, v, d) => {
  intentSubject.next({
    type: GRAPH_ADD_EDGE,
    u,
    v,
    d
  })
}

export const addVertex = (u, d) => {
  intentSubject.next({
    type: GRAPH_ADD_VERTEX,
    u,
    d
  })
}

export const clear = () => {
  intentSubject.next({
    type: GRAPH_CLEAR
  })
}

export const load = (data) => {
  intentSubject.next({
    type: GRAPH_LOAD,
    data
  })
}

export const redo = () => {
  intentSubject.next({
    type: GRAPH_REDO
  })
}

export const removeEdge = (u, v) => {
  intentSubject.next({
    type: GRAPH_REMOVE_EDGE,
    u,
    v
  })
}

export const removeVertex = (u) => {
  intentSubject.next({
    type: GRAPH_REMOVE_VERTEX,
    u
  })
}

export const undo = () => {
  intentSubject.next({
    type: GRAPH_UNDO
  })
}

export const updateEdge = (u, v, ud, vd, d) => {
  intentSubject.next({
    type: GRAPH_UPDATE_EDGE,
    u,
    v,
    ud,
    vd,
    d
  })
}

export const updateVertex = (u, d) => {
  intentSubject.next({
    type: GRAPH_UPDATE_VERTEX,
    u,
    d
  })
}
