import Rx from 'rx'
import {
  ADD_PROJECT,
  GET_PROJECT,
  LOAD_PROJECTS,
  REMOVE_PROJECT,
  UPDATE_PROJECT,
} from '../constants'

export const intentSubject = new Rx.Subject();

export const addProject = (data) => {
  intentSubject.onNext({
    type: ADD_PROJECT,
    data,
  });
};

export const getProject = (id) => {
  intentSubject.onNext({
    type: GET_PROJECT,
    id,
  });
};

export const loadProjects = () => {
  intentSubject.onNext({
    type: LOAD_PROJECTS,
  });
};

export const removeProject = (id) => {
  intentSubject.onNext({
    type: REMOVE_PROJECT,
    id,
  });
};

export const updateProject = (data) => {
  intentSubject.onNext({
    type: UPDATE_PROJECT,
    data,
  });
};
