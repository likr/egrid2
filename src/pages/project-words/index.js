import m from 'mithril'
import {
  PROJECT_GET,
  PROJECT_UPDATE,
} from '../../constants'
import Projects from '../../models/project'
import {getProject, updateProject} from '../../intents/project'
import Page from '../common/page'
import Word from './word'

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

const handleInputGroupName = (group) => {
  return (event) => {
    group.name = event.target.value;
  };
};

const handleInputGroupColor = (group) => {
  return (event) => {
    group.color = event.target.value;
  };
};

const handleSearch = (ctrl) => {
  return (event) => {
    ctrl.search = event.target.value;
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
    projectId: m.route.param('projectId'),
    project: null,
    words: {},
    groups: [],
    search: '',
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
        m.route(`/projects/${ctrl.projectId}`);
        break;
    }
  });

  ctrl.onunload = () => {
    projectSubscription.dispose();
  };

  getProject(ctrl.projectId);

  return ctrl;
};

const view = (ctrl) => {
  const words = Object.values(ctrl.words).filter(({d}) => d.parent == undefined && d.text.indexOf(ctrl.search) >= 0);

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
            <button className="ui button" onclick={handleSave(ctrl)}>Save</button>
          </div>
        </div>
        <div className="two column row">
          <div className="column">
            <div className="ui vertical segment">
              <div className="ui fluid icon input">
                <input placeholder="Search..." oninput={handleSearch(ctrl)}/>
                <i className="icon search"/>
              </div>
            </div>
            <div className="ui vertical segment" ondrop={handleDropToList(ctrl)} ondragover={handleDragOver} style={{'max-height': '800px', 'overflow-y': 'scroll'}}>
              {words.map((item) => <Word {...item}/>)}
            </div>
          </div>
          <div className="ui vertical divider">
            <i className="icon arrow right"/>
          </div>
          <div className="column">
            <div className="ui vertical segment">
              <button className="ui button" onclick={handleAddGroup(ctrl)}>Add</button>
            </div>
            <div className="ui vertical segment" style={{'max-height': '800px', 'overflow-y': 'scroll'}}>
              <div className="ui one cards">
                {ctrl.groups.map((group) => {
                  return <div className="ui card" ondrop={handleDropToGroup(ctrl, group)} ondragover={handleDragOver}>
                    <div className="content">
                      <div className="ui form">
                        <div className="two fields">
                          <div className="field">
                            <label>Name</label>
                            <input type="text" value={group.name} oninput={handleInputGroupName(group)}/>
                          </div>
                          <div className="field">
                            <label>Color</label>
                            <input type="color" value={group.color} oninput={handleInputGroupColor(group)}/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content" style={{'min-height': '100px'}}>
                      {group.items.map((u) => <Word {...ctrl.words[u]}/>)}
                    </div>
                  </div>
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
