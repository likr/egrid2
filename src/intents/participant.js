import Rx from 'rxjs/Rx'
import {
  PARTICIPANT_ADD,
  PARTICIPANT_GET,
  PARTICIPANT_LIST,
  PARTICIPANT_REMOVE,
  PARTICIPANT_UPDATE
} from '../constants'

export const intentSubject = new Rx.Subject()

export const addParticipant = (data) => {
  intentSubject.next({
    type: PARTICIPANT_ADD,
    data
  })
}

export const getParticipant = (id) => {
  intentSubject.next({
    type: PARTICIPANT_GET,
    id
  })
}

export const listParticipants = (projectId) => {
  intentSubject.next({
    type: PARTICIPANT_LIST,
    projectId
  })
}

export const removeParticipant = (id) => {
  intentSubject.next({
    type: PARTICIPANT_REMOVE,
    id
  })
}

export const updateParticipant = (data) => {
  intentSubject.next({
    type: PARTICIPANT_UPDATE,
    data
  })
}
