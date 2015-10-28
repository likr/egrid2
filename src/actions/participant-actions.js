import {
  ADD_PARTICIPANT,
  DELETE_PARTICIPANT,
  LOAD_PARTICIPANTS
} from '../action-types'
import db from '../db'

const queryAll = () => {
  return new Promise((resolve) => {
    db.participants.toArray((participants) => {
      const result = {};
      for (const participant of participants) {
        result[participant.id] = participant;
      }
      resolve(result);
    });
  });
};

export const addParticipant = (name) => {
  return (dispatch) => {
    db.participants.add({name})
      .then(() => queryAll())
      .then((participants) => {
        dispatch({
          type: ADD_PARTICIPANT,
          participants
        });
      });
  };
};

export const deleteParticipant = (id) => {
  return (dispatch) => {
    db.participants.delete(id)
      .then(() => queryAll())
      .then((participants) => {
        dispatch({
          type: DELETE_PARTICIPANT,
          participants
        });
      });
  };
};

export const loadParticipants = () => {
  return (dispatch) => {
    queryAll().then((participants) => {
      dispatch({
        type: LOAD_PARTICIPANTS,
        participants
      });
    });
  };
};
