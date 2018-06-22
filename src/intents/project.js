import {Subject} from 'rxjs'
import {
  PROJECT_ADD,
  PROJECT_GET,
  PROJECT_LIST,
  PROJECT_REMOVE,
  PROJECT_UPDATE,
  PROJECT_SYNC
} from '../constants'

export const intentSubject = new Subject()

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

export const syncProjects = () => {
  intentSubject.next({
    type: PROJECT_SYNC
  })
}
