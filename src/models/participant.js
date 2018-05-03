import {Subject} from 'rxjs'
import {share} from 'rxjs/operators'
import {
  PARTICIPANT_ADD,
  PARTICIPANT_GET,
  PARTICIPANT_LIST,
  PARTICIPANT_REMOVE,
  PARTICIPANT_UPDATE
} from '../constants'
import {intentSubject} from '../intents/participant'
import db from './db'

const participants = db.collection('participants')

const subject = new Subject()

const load = (type, projectId) => {
  participants.list({filters: {projectId}, order: '-updated'})
    .then(({data}) => {
      for (const item of data) {
        item.created = new Date(item.created)
        item.updated = new Date(item.updated)
      }
      subject.next({type, data})
    })
}

const add = (data) => {
  participants
    .create(Object.assign({}, data, {
      created: new Date(),
      updated: new Date()
    }))
    .then(() => load(PARTICIPANT_ADD, data.projectId))
}

const get = (id) => {
  participants.get(id)
    .then(({data}) => {
      data.created = new Date(data.created)
      data.updated = new Date(data.updated)
      subject.next({type: PARTICIPANT_GET, data})
    })
}

const list = (projectId) => {
  load(PARTICIPANT_LIST, projectId)
}

const remove = (id) => {
  participants.delete(id)
    .then(({data}) => load(PARTICIPANT_REMOVE, data.projectId))
}

const update = (data) => {
  participants.update(data)
    .then(() => load(PARTICIPANT_UPDATE, data.projectId))
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

export default subject.pipe(share())
