import {
  ADD_PROJECT,
  DELETE_PROJECT,
  LOAD_PROJECTS,
  UPDATE_PROJECT
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

export const addProject = (d) => {
  const now = new Date();
  const data = Object.assign({}, d, {
    evaluationStructure: JSON.stringify({
      vertices: [],
      edges: []
    }),
    created: now,
    updated: now
  });
  return (dispatch) => {
    db.projects.add(data)
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
    db.projects.delete(+id)
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

export const updateProject = (id, attrs) => {
  return (dispatch) => {
    db.projects.update(+id, attrs)
      .then(() => queryAll())
      .then((projects) => {
        dispatch({
          type: UPDATE_PROJECT,
          projects
        });
      });
  };
};
