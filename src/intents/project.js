import Rx from 'rx'
import { PROJECT_ADD, PROJECT_GET, PROJECT_LIST, PROJECT_REMOVE, PROJECT_UPDATE,
} from '../constants'

export const intentSubject = new Rx.Subject()

export const addProject = (data) => {
  intentSubject.onNext({
    type: PROJECT_ADD,
    data,
  })
}

export const getProject = (id) => {
  intentSubject.onNext({
    type: PROJECT_GET,
    id,
  })
}

export const loadProjects = () => {
  intentSubject.onNext({
    type: PROJECT_LIST,
  })
}

export const removeProject = (id) => {
  intentSubject.onNext({
    type: PROJECT_REMOVE,
    id,
  })
}

export const updateProject = (data) => {
  intentSubject.onNext({
    type: PROJECT_UPDATE,
    data,
  })
}
