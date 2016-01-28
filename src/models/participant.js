import Rx from 'rx'
import {
  PARTICIPANT_ADD,
  PARTICIPANT_GET,
  PARTICIPANT_LIST,
  PARTICIPANT_REMOVE,
  PARTICIPANT_UPDATE,
} from '../constants'
import {intentSubject} from '../intents/participant'
import db from './db'

const participants = db.collection('participants');

const subject = new Rx.Subject();

const add = (data) => {
  participants
    .create(Object.assign({}, data, {
      created: new Date(),
      updated: new Date(),
    }))
    .then(() => list(data.projectId));
};

const list = (projectId) => {
  participants
    .list({
      filters: {projectId},
      order: '-updated',
    })
    .then(({data}) => {
      subject.onNext(data);
    });
};

const remove = (id) => {
  participants
    .delete(id)
    .then(({data}) => list(data.projectId));
};

const update = (data) => {
  participants
    .update(data)
    .then(() => list(data.projectId));
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case PARTICIPANT_ADD:
      add(payload.data);
      break;
    case PARTICIPANT_GET:
      break;
    case PARTICIPANT_LIST:
      list(payload.projectId);
      break;
    case PARTICIPANT_REMOVE:
      remove(payload.id);
      break;
    case PARTICIPANT_UPDATE:
      update(payload.data);
      break;
  }
});

export default subject
