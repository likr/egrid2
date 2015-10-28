import {
  ADD_PARTICIPANT,
  DELETE_PARTICIPANT,
  LOAD_PARTICIPANTS
} from '../action-types'

const addParticipant = (state, {participants}) => {
  return participants;
};

const deleteParticipant = (state, {participants}) => {
  return participants;
};

const loadParticipants = (state, {participants}) => {
  return participants;
};

const participantReducer = (state={}, action) => {
  switch (action.type) {
    case ADD_PARTICIPANT:
      return addParticipant(state, action);
    case DELETE_PARTICIPANT:
      return deleteParticipant(state, action);
    case LOAD_PARTICIPANTS:
      return loadParticipants(state, action);
    default:
      return state;
  }
};

export default participantReducer
