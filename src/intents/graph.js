import Rx from 'rx'
import { GRAPH_ADD_EDGE, GRAPH_ADD_VERTEX, GRAPH_CLEAR, GRAPH_LOAD, GRAPH_REDO, GRAPH_REMOVE_EDGE, GRAPH_REMOVE_VERTEX, GRAPH_UNDO, GRAPH_UPDATE_EDGE, GRAPH_UPDATE_VERTEX,
} from '../constants'

export const intentSubject = new Rx.Subject()

export const addEdge = (u, v, d) => {
  intentSubject.onNext({
    type: GRAPH_ADD_EDGE,
    u,
    v,
    d,
  })
}

export const addVertex = (u, d) => {
  intentSubject.onNext({
    type: GRAPH_ADD_VERTEX,
    u,
    d,
  })
}

export const clear = () => {
  intentSubject.onNext({
    type: GRAPH_CLEAR,
  })
}

export const load = (data) => {
  intentSubject.onNext({
    type: GRAPH_LOAD,
    data,
  })
}

export const redo = () => {
  intentSubject.onNext({
    type: GRAPH_REDO,
  })
}

export const removeEdge = (u, v) => {
  intentSubject.onNext({
    type: GRAPH_REMOVE_EDGE,
    u,
    v,
  })
}

export const removeVertex = (u) => {
  intentSubject.onNext({
    type: GRAPH_REMOVE_VERTEX,
    u,
  })
}

export const undo = () => {
  intentSubject.onNext({
    type: GRAPH_UNDO,
  })
}

export const updateEdge = (u, v, ud, vd, d) => {
  intentSubject.onNext({
    type: GRAPH_UPDATE_EDGE,
    u,
    v,
    ud,
    vd,
    d,
  })
}

export const updateVertex = (u, d) => {
  intentSubject.onNext({
    type: GRAPH_UPDATE_VERTEX,
    u,
    d,
  })
}
