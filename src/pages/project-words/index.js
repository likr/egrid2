import m from 'mithril'
import Projects from '../../models/project'
import {getProject} from '../../intents/project'
import Page from '../common/page'

const controller = () => {
  const ctrl = {
    projectId: m.route.param('projectId'),
    project: null,
    words: [],
  };

  const projectSubscription = Projects.subscribe(({data}) => {
    m.startComputation();
    ctrl.project = data;
    const graph = JSON.parse(ctrl.project.graph);
    ctrl.words = graph.vertices;
    m.endComputation();
  });

  ctrl.onunload = () => {
    projectSubscription.dispose();
  };

  getProject(ctrl.projectId);

  return ctrl;
};

const view = (ctrl) => {
  return <Page>
    <div style={{'margin-bottom': '20px'}}>
      <div className="ui breadcrumb">
        <a className="section" href="/projects" config={m.route}>My Projects</a>
        <i className="right angle icon divider"/>
        <a className="section" href={`/projects/${ctrl.projectId}`} config={m.route}>{ctrl.project && ctrl.project.name}</a>
        <i className="right angle icon divider"/>
        <div className="active section">Words</div>
      </div>
      <div>
        {ctrl.words.map(({d}) => {
          return <div className="ui compact message" style={{margin: '5px'}}>{d.text}</div>
        })}
      </div>
    </div>
  </Page>
};

export default {controller, view}
