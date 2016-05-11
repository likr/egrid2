import Rx from 'rx'
import { PARTICIPANT_ADD, PARTICIPANT_GET, PARTICIPANT_LIST, PARTICIPANT_REMOVE, PARTICIPANT_UPDATE,
} from '../constants'

export const intentSubject = new Rx.Subject()

export const addParticipant = (data) => {
  intentSubject.onNext({
    type: PARTICIPANT_ADD,
    data,
  })
}

export const getParticipant = (id) => {
  intentSubject.onNext({
    type: PARTICIPANT_GET,
    id,
  })
}

export const listParticipants = (projectId) => {
  intentSubject.onNext({
    type: PARTICIPANT_LIST,
    projectId,
  })
}

export const removeParticipant = (id) => {
  intentSubject.onNext({
    type: PARTICIPANT_REMOVE,
    id,
  })
}

export const updateParticipant = (data) => {
  intentSubject.onNext({
    type: PARTICIPANT_UPDATE,
    data,
  })
}
