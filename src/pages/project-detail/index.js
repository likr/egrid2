import m from 'mithril'
import Projects from '../../models/project'
import {getProject} from '../../intents/project'
import Page from '../common/page'

const controller = () => {
  const ctrl = {
    project: null,
  };

  const subscription = Projects.subscribe((project) => {
    m.startComputation();
    ctrl.project = project;
    m.endComputation();
  });

  getProject(m.route.param('projectId'));

  ctrl.onunload = () => {
    subscription.dispose();
  };

  return ctrl;
};

const view = (ctrl) => {
  if (!ctrl.project) {
    return '';
  }

  return <Page>
    <div style={{
      'margin-bottom': '20px',
    }}>
      <h2>{ctrl.project.name}</h2>
    </div>
    <div>
      <a
          className="ui button"
          href={`/projects/${m.route.param('projectId')}/analysis`}
          config={m.route}>
        Analysis
      </a>
    </div>
  </Page>
};

export default {controller, view}
