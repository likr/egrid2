/* global $ */
import m from 'mithril'
import {removeProject, updateProject} from '../../../intents/project'

const formatDate = (date) => {
  if (!date) {
    return '';
  }
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

const popup = (element, init) => {
  if (!init) {
    $(element).popup({
      position: 'bottom left',
    });
  }
};

const projectView = (project, {confirmModal, projectModal}) => {
  return <div key={project.id} className="card">
    <div className="content">
      <div className="header">{project.name}</div>
      <div className="meta">Created at: {formatDate(project.created)}</div>
      <div className="meta">Updated at: {formatDate(project.updated)}</div>
      <div className="description">{project.note}</div>
    </div>
    <div className="ui bottom attached four buttons">
      <a className="ui button" href={`/projects/${project.id}`} config={m.route}>Open</a>
      <button className="ui icon button" data-content="Edit" config={popup} onclick={() => {
        projectModal.show({
          title: 'Update Project',
          data: {
            name: project.name,
            note: project.note,
          },
          onapprove: (data) => {
            updateProject(Object.assign(project, data));
          },
          ondeny: () => {
          },
        });
      }}>
        <i className="icon edit"/>
      </button>
      <button className="ui icon button" data-content="Remove" config={popup} onclick={() => {
        confirmModal.show({
          title: 'Remove Project ?',
          text: 'Remove Project ?',
          onapprove: () => {
            removeProject(project.id);
          },
          ondeny: () => {
          },
        });
      }}>
        <i className="icon remove"/>
      </button>
      <button className="ui icon button" data-content="Copy" config={popup}>
        <i className="icon copy"/>
      </button>
    </div>
  </div>
};

export default projectView
