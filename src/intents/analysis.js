import {Subject} from 'rxjs'
import {
  ANALYSIS_INIT,
  ANALYSIS_SELECT_VERTEX,
  ANALYSIS_SELECT_VERTICES_BY_WORD,
  ANALYSIS_SET_THRESHOLD,
  ANALYSIS_UPDATE_GRAPH,
  ANALYSIS_UPDATE_PARTICIPANTS
} from '../constants'

export const intentSubject = new Subject()

export const initAnalysis = (graph, participants) => {
  intentSubject.next({
    type: ANALYSIS_INIT,
    graph,
    participants
  })
}

export const selectVertex = (u) => {
  intentSubject.next({
    type: ANALYSIS_SELECT_VERTEX,
    u
  })
}

export const selectVerticesByWord = (word) => {
  intentSubject.next({
    type: ANALYSIS_SELECT_VERTICES_BY_WORD,
    word
  })
}

export const setThreshold = (threshold) => {
  intentSubject.next({
    type: ANALYSIS_SET_THRESHOLD,
    threshold
  })
}

export const updateGraph = (graph) => {
  intentSubject.next({
    type: ANALYSIS_UPDATE_GRAPH,
    graph
  })
}

export const updateParticipants = (participants) => {
  intentSubject.next({
    type: ANALYSIS_UPDATE_PARTICIPANTS,
    participants
  })
}
