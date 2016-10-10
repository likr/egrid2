import Rx from 'rxjs/Rx'
import {
  PROJECT_ADD,
  PROJECT_GET,
  PROJECT_LIST,
  PROJECT_REMOVE,
  PROJECT_UPDATE
} from '../constants'

export const intentSubject = new Rx.Subject()

export const addProject = (data) => {
  intentSubject.next({
    type: PROJECT_ADD,
    data
  })
}

export const getProject = (id) => {
  intentSubject.next({
    type: PROJECT_GET,
    id
  })
}

export const loadProjects = () => {
  intentSubject.next({
    type: PROJECT_LIST
  })
}

export const removeProject = (id) => {
  intentSubject.next({
    type: PROJECT_REMOVE,
    id
  })
}

export const updateProject = (data) => {
  intentSubject.next({
    type: PROJECT_UPDATE,
    data
  })
}
