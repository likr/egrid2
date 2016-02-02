import Rx from 'rx'
import {
  ANALYSIS_INIT,
  ANALYSIS_SET_THRESHOLD,
  ANALYSIS_UPDATE_PARTICIPANTS,
  ANALYSIS_UPDATE_WORDS,
} from '../constants'
import {intentSubject} from '../intents/analysis'

const subject = new Rx.Subject();

const state = {
  graph: {
    vertices: [],
    edges: [],
  },
  participants: {},
  words: {},
  threshold: 0.7,
};

const originalData = {
  vertices: [],
  edges: [],
};

const filterByParticipants = () => {
  const participantIds = new Set(Object.values(state.participants)
    .filter(({checked}) => checked)
    .map(({participant}) => participant.id));
  state.graph.vertices = originalData.vertices.filter(({d}) => d.participants.some((id) => participantIds.has(id)));
  state.graph.edges = originalData.edges.filter(({d}) => d.participants.some((id) => participantIds.has(id)));
};

const next = (type) => {
  subject.onNext({type, state});
};

const init = ({graph, participants}) => {
  Object.assign(originalData, graph);
  Object.assign(state.graph, graph);
  state.participants = {};
  for (const participant of participants) {
    state.participants[participant.id] = {
      participant,
      checked: true,
    };
  }
  filterByParticipants();
  next(ANALYSIS_INIT);
};

const updateParticipants = ({participants}) => {
  for (const id in state.participants) {
    if (participants[id] === true) {
      state.participants[id].checked = true;
    } else if (participants[id] === false) {
      state.participants[id].checked = false;
    }
  }
  filterByParticipants();
  next(ANALYSIS_UPDATE_PARTICIPANTS);
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case ANALYSIS_INIT:
      init(payload);
      break;
    case ANALYSIS_SET_THRESHOLD:
      break;
    case ANALYSIS_UPDATE_PARTICIPANTS:
      updateParticipants(payload);
      break;
    case ANALYSIS_UPDATE_WORDS:
      break;
  }
});

export default subject
