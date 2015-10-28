import {
  ADD_PROJECT,
  DELETE_PROJECT,
  LOAD_PROJECTS,
  UPDATE_PROJECT
} from '../action-types'

const addProject = (state, {projects}) => {
  return projects;
};

const deleteProject = (state, {projects}) => {
  return projects;
};

const loadProjects = (state, {projects}) => {
  return projects;
};

const updateProject = (state, {projects}) => {
  return projects;
};

const projectReducer = (state={}, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      return addProject(state, action);
    case DELETE_PROJECT:
      return deleteProject(state, action);
    case LOAD_PROJECTS:
      return loadProjects(state, action);
    case UPDATE_PROJECT:
      return updateProject(state, action);
    default:
      return state;
  }
};

export default projectReducer
