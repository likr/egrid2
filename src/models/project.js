import Rx from 'rx'
import {
  PROJECT_ADD,
  PROJECT_GET,
  PROJECT_LIST,
  PROJECT_REMOVE,
  PROJECT_UPDATE,
} from '../constants'
import {intentSubject} from '../intents/project'
import db from './db'

const projects = db.collection('projects');

const subject = new Rx.Subject();

const load = (type) => {
  projects.list({order: '-updated'})
    .then(({data}) => {
      subject.onNext({type, data});
    });
};

const add = (data) => {
  const now = new Date();
  const project = Object.assign({}, data, {
    graph: '{"vertices":[],"edges":[]}',
    created: now,
    updated: now,
  });
  projects.create(project)
    .then(() => load(PROJECT_ADD));
};

const get = (id) => {
  projects.get(id)
    .then(({data}) => {
      subject.onNext({type: PROJECT_GET, data});
    });
};

const list = () => {
  load(PROJECT_LIST);
};

const remove = (id) => {
  projects.delete(id)
    .then(() => load(PROJECT_REMOVE));
};

const update = (data) => {
  const now = new Date();
  projects
    .update(Object.assign({}, data, {
      updated: now,
    }))
    .then(() => load(PROJECT_UPDATE));
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case PROJECT_ADD:
      add(payload.data);
      break;
    case PROJECT_GET:
      get(payload.id);
      break;
    case PROJECT_LIST:
      list();
      break;
    case PROJECT_REMOVE:
      remove(payload.id);
      break;
    case PROJECT_UPDATE:
      update(payload.data);
      break;
  }
});

export default subject.share()
