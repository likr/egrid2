/* global confirm */
import m from 'mithril'
import {
  PROJECT_GET,
  PROJECT_UPDATE,
} from '../../constants'
import Projects from '../../models/project'
import {getProject, updateProject} from '../../intents/project'
import Page from '../common/page'
import Word from './word'
import Group from './group'

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const handleDropToList = (ctrl) => {
  return (event) => {
    const u = event.dataTransfer.getData("text");
    const data = ctrl.words[u];
    if (data.d.parent != undefined) {
      const group = ctrl.groups[data.d.parent];
      group.items.splice(group.items.indexOf(u), 1);
      delete data.d.parent;
    }
    ctrl.saved = false;
  };
};

const handleDropToGroup = (ctrl, group) => {
  return (event) => {
    const u = event.dataTransfer.getData("text");
    const data = ctrl.words[u];
    if (data.d.parent != undefined) {
      const oldGroup = ctrl.groups[data.d.parent];
      oldGroup.items.splice(oldGroup.items.indexOf(u), 1);
    }
    group.items.push(u);
    data.d.parent = group.id;
    ctrl.saved = false;
  };
};

const handleAddGroup = (ctrl) => {
  return () => {
    ctrl.groups.push({
      id: Math.max(0, ...ctrl.groups.map(({id}) => id + 1)),
      name: '',
      color: '#ffffff',
      items: [],
    });
  };
};

const handleInputSearchLeft = (ctrl) => {
  return (event) => {
    ctrl.searchLeft = event.target.value;
  };
};

const handleInputSearchRight = (ctrl) => {
  return (event) => {
    ctrl.searchRight = event.target.value;
  };
};

const handleSave = (ctrl) => {
  return () => {
    const graph = Object.assign(JSON.parse(ctrl.project.graph), {
      vertices: Object.values(ctrl.words),
      groups: ctrl.groups,
    });
    ctrl.project.graph = JSON.stringify(graph);
    updateProject(ctrl.project);
  };
};

const controller = () => {
  const ctrl = {
    saved: true,
    projectId: m.route.param('projectId'),
    project: null,
    words: {},
    groups: [],
    searchLeft: '',
    searchRight: '',
  };

  const projectSubscription = Projects.subscribe(({type, data}) => {
    switch (type) {
      case PROJECT_GET:
        m.startComputation();
        ctrl.project = data;
        const graph = JSON.parse(ctrl.project.graph);
        ctrl.words = {};
        for (const vertex of graph.vertices) {
          ctrl.words[vertex.u] = vertex;
        }
        ctrl.groups = graph.groups || [];
        m.endComputation();
        break;
      case PROJECT_UPDATE:
        ctrl.saved = true;
        m.route(`/projects/${ctrl.projectId}`);
        break;
    }
  });

  ctrl.onunload = (event) => {
    if (!ctrl.saved && !confirm('保存せずに終了しますか？')) {
      event.preventDefault();
      return;
    }
    projectSubscription.dispose();
  };

  getProject(ctrl.projectId);

  return ctrl;
};

const view = (ctrl) => {
  const words = Object.values(ctrl.words).filter(({d}) => {
    return d.parent == undefined && d.text.indexOf(ctrl.searchLeft) >= 0;
  });
  const groups = ctrl.groups.filter((group) => {
    if (group.name.indexOf(ctrl.searchRight) >= 0) {
      return true;
    }
    return group.items.some((u) => ctrl.words[u].d.text.indexOf(ctrl.searchRight) >= 0);
  });

  return <Page>
    <div style={{'margin-bottom': '20px'}}>
      <div className="ui breadcrumb">
        <a className="section" href="/projects" config={m.route}>My Projects</a>
        <i className="right angle icon divider"/>
        <a className="section" href={`/projects/${ctrl.projectId}`} config={m.route}>{ctrl.project && ctrl.project.name}</a>
        <i className="right angle icon divider"/>
        <div className="active section">Words</div>
      </div>
    </div>
    <div>
      <div className="ui grid">
        <div className="row">
          <div className="column">
            <button className="ui primary button" onclick={handleSave(ctrl)}>Save</button>
          </div>
        </div>
        <div className="two column row">
          <div className="column">
            <div className="ui vertical segment">
              <div className="ui fluid icon input">
                <input placeholder="Search..." oninput={handleInputSearchLeft(ctrl)}/>
                <i className="icon search"/>
              </div>
            </div>
            <div className="ui vertical segment" ondrop={handleDropToList(ctrl)} ondragover={handleDragOver} style={{'max-height': '700px', 'overflow-y': 'scroll'}}>
              {words.map((item) => <Word {...item}/>)}
            </div>
          </div>
          <div className="ui vertical divider">
            <i className="icon arrow right"/>
          </div>
          <div className="column">
            <div className="ui vertical segment">
              <div className="ui fluid icon input">
                <input placeholder="Search..." oninput={handleInputSearchRight(ctrl)}/>
                <i className="icon search"/>
              </div>
              <button className="ui button" onclick={handleAddGroup(ctrl)}>Add</button>
            </div>
            <div className="ui vertical segment" style={{'max-height': '700px', 'overflow-y': 'scroll'}}>
              <div className="ui one cards">
                {groups.map((group) => {
                  return <Group group={group} words={ctrl.words} handleDropToGroup={handleDropToGroup(ctrl, group)} handleDragOver={handleDragOver}/>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
};

export default {controller, view}
