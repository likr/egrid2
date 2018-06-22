import {Subject} from 'rxjs'
import {share} from 'rxjs/operators'
import {
  PROJECT_ADD,
  PROJECT_GET,
  PROJECT_LIST,
  PROJECT_REMOVE,
  PROJECT_UPDATE,
  PROJECT_SYNC
} from '../constants'
import {intentSubject} from '../intents/project'
import db from './db'

const projects = db.collection('projects')

const subject = new Subject()

const load = (type) => {
  projects.list({order: '-updated'})
    .then(({data}) => {
      for (const item of data) {
        item.created = new Date(item.created)
        item.updated = new Date(item.updated)
      }
      subject.next({type, data})
    })
}

const add = (data) => {
  const now = new Date()
  const project = Object.assign({}, data, {
    graph: '{"vertices":[],"edges":[]}',
    created: now,
    updated: now
  })
  projects.create(project)
    .then(() => load(PROJECT_ADD))
}

const get = (id) => {
  projects.get(id)
    .then(({data}) => {
      data.created = new Date(data.created)
      data.updated = new Date(data.updated)
      subject.next({type: PROJECT_GET, data})
    })
}

const list = () => {
  load(PROJECT_LIST)
}

const remove = (id) => {
  projects.delete(id)
    .then(() => load(PROJECT_REMOVE))
}

const update = (data) => {
  const now = new Date()
  projects
    .update(Object.assign({}, data, {
      updated: now
    }))
    .then(() => load(PROJECT_UPDATE))
}

const sync = () => {
  projects.sync().then(() => {
    load(PROJECT_SYNC)
  })
}

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case PROJECT_ADD:
      add(payload.data)
      break
    case PROJECT_GET:
      get(payload.id)
      break
    case PROJECT_LIST:
      list()
      break
    case PROJECT_REMOVE:
      remove(payload.id)
      break
    case PROJECT_UPDATE:
      update(payload.data)
      break
    case PROJECT_SYNC:
      sync()
      break
  }
})

export default subject.pipe(share())
