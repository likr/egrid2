import {
  ADD_PROJECT,
  DELETE_PROJECT,
  LOAD_PROJECTS
} from '../action-types'
import db from '../db'

const queryAll = () => {
  return new Promise((resolve) => {
    db.projects.toArray((projects) => {
      const result = {};
      for (const project of projects) {
        result[project.id] = project;
      }
      resolve(result);
    });
  });
};

export const addProject = (name) => {
  return (dispatch) => {
    db.projects.add({name})
      .then(() => queryAll())
      .then((projects) => {
        dispatch({
          type: ADD_PROJECT,
          projects
        });
      });
  };
};

export const deleteProject = (id) => {
  return (dispatch) => {
    db.projects.delete(id)
      .then(() => queryAll())
      .then((projects) => {
        dispatch({
          type: DELETE_PROJECT,
          projects
        });
      });
  };
};

export const loadProjects = () => {
  return (dispatch) => {
    queryAll().then((projects) => {
      dispatch({
        type: LOAD_PROJECTS,
        projects
      });
    });
  };
};
