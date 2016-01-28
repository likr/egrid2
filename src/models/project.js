import Rx from 'rx'
import {
  ADD_PROJECT,
  GET_PROJECT,
  LOAD_PROJECTS,
  REMOVE_PROJECT,
  UPDATE_PROJECT,
} from '../constants'
import {intentSubject} from '../intents/project'
import db from './db'

const projects = db.collection('projects');

const subject = new Rx.Subject();

const add = (data) => {
  const now = new Date();
  const project = Object.assign({}, data, {
    created: now,
    updated: now,
  });
  projects.create(project)
    .then(load);
};

const get = (id) => {
  projects.get(id)
    .then(({data}) => {
      subject.onNext(data);
    });
};

const load = () => {
  projects.list({order: '-updated'})
    .then(({data}) => {
      subject.onNext(data);
    });
};

const remove = (id) => {
  projects.delete(id)
    .then(load);
};

const update = (data) => {
  const now = new Date();
  projects
    .update(Object.assign({}, data, {
      updated: now,
    }))
    .then(load);
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case ADD_PROJECT:
      add(payload.data);
      break;
    case GET_PROJECT:
      get(payload.id);
      break;
    case LOAD_PROJECTS:
      load();
      break;
    case REMOVE_PROJECT:
      remove(payload.id);
      break;
    case UPDATE_PROJECT:
      update(payload.data);
      break;
  }
});

export default subject
