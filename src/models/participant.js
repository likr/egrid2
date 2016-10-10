import Rx from 'rxjs/Rx'
import lf from 'lovefield'
import uuid from 'uuid'
import {
  PARTICIPANT_ADD,
  PARTICIPANT_GET,
  PARTICIPANT_LIST,
  PARTICIPANT_REMOVE,
  PARTICIPANT_UPDATE
} from '../constants'
import {intentSubject} from '../intents/participant'
import {connection} from './db'

const subject = new Rx.Subject()

const load = (type, projectId) => {
  connection.then((db) => {
    const schema = db.getSchema().table('Participant')
    db.select()
      .from(schema)
      .where(schema.projectId.eq(projectId))
      .orderBy(schema.updated, lf.Order.DESC)
      .exec()
      .then((data) => {
        subject.next({type, data})
      })
  })
}

const add = (data) => {
  const now = new Date()
  const participant = Object.assign({}, data, {
    id: uuid.v4(),
    created: now,
    updated: now
  })
  connection.then((db) => {
    const schema = db.getSchema().table('Participant')
    const row = schema.createRow(participant)
    db.insertOrReplace()
      .into(schema)
      .values([row])
      .exec()
      .then(() => {
        load(PARTICIPANT_ADD, data.projectId)
      })
  })
}

const get = (id) => {
  connection.then((db) => {
    const schema = db.getSchema().table('Participant')
    db.select()
      .from(schema)
      .where(schema.id.eq(id))
      .exec()
      .then(([data]) => {
        subject.next({type: PARTICIPANT_GET, data})
      })
  })
}

const list = (projectId) => {
  load(PARTICIPANT_LIST, projectId)
}

const remove = (id) => {
  connection.then((db) => {
    const schema = db.getSchema().table('Participant')
    db.select()
      .from(schema)
      .where(schema.id.eq(id))
      .exec()
      .then(([data]) => {
        db.delete()
          .from(schema)
          .where(schema.id.eq(id))
          .exec()
          .then(() => {
            load(PARTICIPANT_REMOVE, data.projectId)
          })
      })
  })
}

const update = (data) => {
  const now = new Date()
  connection.then((db) => {
    const schema = db.getSchema().table('Participant')
    db.update(schema)
      .set(schema.name, data.name)
      .set(schema.note, data.note)
      .set(schema.updated, now)
      .where(schema.id.eq(data.id))
      .exec()
      .then(() => {
        load(PARTICIPANT_UPDATE, data.projectId)
      })
  })
}

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case PARTICIPANT_ADD:
      add(payload.data)
      break
    case PARTICIPANT_GET:
      get(payload.id)
      break
    case PARTICIPANT_LIST:
      list(payload.projectId)
      break
    case PARTICIPANT_REMOVE:
      remove(payload.id)
      break
    case PARTICIPANT_UPDATE:
      update(payload.data)
      break
  }
})

export default subject.share()
