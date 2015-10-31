import {
  ADD_PARTICIPANT,
  DELETE_PARTICIPANT,
  LOAD_PARTICIPANTS,
  UPDATE_PARTICIPANT
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

export const addParticipant = (d) => {
  const now = new Date();
  const data = Object.assign({}, d, {
    created: now,
    updated: now
  });
  return (dispatch) => {
    db.participants.add(data)
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

export const updateParticipant = (id, d) => {
  const data = Object.assign({}, d, {
    updated: new Date()
  });
  return (dispatch) => {
    db.participants.update(+id, data)
      .then(() => queryAll())
      .then((participants) => {
        dispatch({
          type: UPDATE_PARTICIPANT,
          participants
        });
      });
  };
};
