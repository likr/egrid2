import Rx from 'rxjs/Rx'
import lf from 'lovefield'
import uuid from 'uuid'
import {
  PROJECT_ADD,
  PROJECT_GET,
  PROJECT_LIST,
  PROJECT_REMOVE,
  PROJECT_UPDATE
} from '../constants'
import {intentSubject} from '../intents/project'
import {connection} from './db'

const subject = new Rx.Subject()

const load = (type) => {
  connection.then((db) => {
    const schema = db.getSchema().table('Project')
    db.select()
      .from(schema)
      .orderBy(schema.updated, lf.Order.DESC)
      .exec()
      .then((data) => {
        subject.next({type, data})
      })
  })
}

const add = (data) => {
  const now = new Date()
  const project = Object.assign({}, data, {
    id: uuid.v4(),
    created: now,
    updated: now
  })
  connection.then((db) => {
    const schema = db.getSchema().table('Project')
    const row = schema.createRow(project)
    db.insertOrReplace()
      .into(schema)
      .values([row])
      .exec()
      .then(() => {
        load(PROJECT_ADD)
      })
  })
}

const get = (id) => {
  connection.then((db) => {
    const schema = db.getSchema().table('Project')
    db.select()
      .from(schema)
      .where(schema.id.eq(id))
      .exec()
      .then(([data]) => {
        subject.next({type: PROJECT_GET, data})
      })
  })
}

const list = () => {
  load(PROJECT_LIST)
}

const remove = (id) => {
  connection.then((db) => {
    const schema = db.getSchema().table('Project')
    db.delete()
      .from(schema)
      .where(schema.id.eq(id))
      .exec()
      .then(() => {
        load(PROJECT_REMOVE)
      })
  })
}

const update = (data) => {
  const now = new Date()
  connection.then((db) => {
    const schema = db.getSchema().table('Project')
    db.update(schema)
      .set(schema.name, data.name)
      .set(schema.note, data.note)
      .set(schema.updated, now)
      .where(schema.id.eq(data.id))
      .exec()
      .then(() => {
        load(PROJECT_UPDATE)
      })
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
  }
})

export default subject.share()
