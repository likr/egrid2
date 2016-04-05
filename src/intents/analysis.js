import Rx from 'rx'
import {
  ANALYSIS_INIT,
  ANALYSIS_SELECT_VERTEX,
  ANALYSIS_SELECT_VERTICES_BY_WORD,
  ANALYSIS_SET_THRESHOLD,
  ANALYSIS_UPDATE_PARTICIPANTS,
} from '../constants'

export const intentSubject = new Rx.Subject();

export const initAnalysis = (graph, participants) => {
  intentSubject.onNext({
    type: ANALYSIS_INIT,
    graph,
    participants,
  });
};

export const selectVertex = (u) => {
  intentSubject.onNext({
    type: ANALYSIS_SELECT_VERTEX,
    u,
  });
};

export const selectVerticesByWord = (word) => {
  intentSubject.onNext({
    type: ANALYSIS_SELECT_VERTICES_BY_WORD,
    word,
  });
};

export const setThreshold = (threshold) => {
  intentSubject.onNext({
    type: ANALYSIS_SET_THRESHOLD,
    threshold,
  });
};

export const updateParticipants = (participants) => {
  intentSubject.onNext({
    type: ANALYSIS_UPDATE_PARTICIPANTS,
    participants,
  });
};
