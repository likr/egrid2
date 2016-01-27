import m from 'mithril'
import {addProject, loadProjects} from '../../intents/project'
import Project from '../../models/project'
import Page from '../common/page'
import projectView from './views/project'
import ConfirmModal from './confirm-modal'
import ProjectModal from './project-modal'

const controller = () => {
  const ctrl = {
    projects: [],
    projectModal: null,
    confirmModal: null,
  };

  const subscription = Project.subscribe((projects) => {
    m.startComputation();
    ctrl.projects = projects;
    m.endComputation();
  });

  ctrl.onunload = () => {
    subscription.dispose();
  };

  loadProjects();

  return ctrl;
};

const showModal = (ctrl) => {
  if (ctrl.projectModal) {
    ctrl.projectModal.show({
      title: 'Create Project',
      data: {
        name: '',
        note: '',
      },
      onapprove: (data) => {
        addProject(data);
      },
    });
  }
};

const view = (ctrl) => {
  return <Page>
    <div style={{
      'margin-bottom': '20px',
    }}>
      <h2>My Projects</h2>
    </div>
    <div style={{
      'margin-bottom': '20px',
    }}>
      <button className="ui primary button" onclick={showModal.bind(null, ctrl)}>
        Add
      </button>
    </div>
    <div className="ui three stackable cards">
      {ctrl.projects.map((project) => {
        return projectView(project, {
          confirmModal: ctrl.confirmModal,
          projectModal: ctrl.projectModal,
        });
      })}
    </div>
    <ConfirmModal
        onregister={(modal) => {
          ctrl.confirmModal = modal;
        }}/>
    <ProjectModal
        onregister={(modal) => {
          ctrl.projectModal = modal;
        }}/>
  </Page>
};

export default {controller, view}
