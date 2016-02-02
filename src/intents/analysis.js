import Rx from 'rx'
import {
  ANALYSIS_INIT,
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

export const updateParticipants = (participants) => {
  intentSubject.onNext({
    type: ANALYSIS_UPDATE_PARTICIPANTS,
    participants,
  });
};

export const setThreshold = (threshold) => {
  intentSubject.onNext({
    type: ANALYSIS_SET_THRESHOLD,
    threshold,
  });
};
