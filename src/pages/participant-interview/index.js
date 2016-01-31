/* global confirm */
import m from 'mithril'
import part from '../../utils/partial'
import {
  PROJECT_GET,
  PROJECT_UPDATE,
} from '../../constants'
import {updateVertex, load, undo, redo} from '../../intents/graph'
import {calcLayout} from '../../intents/layout-worker'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import Graph from '../../models/graph'
import {getProject, updateProject} from '../../intents/project'
import {getParticipant} from '../../intents/participant'
import ConfirmModal from '../common/confirm-modal'
import Fullscreen from '../common/fullscreen'
import TextInputModal from '../common/text-input-modal'
import Network from './network'

const layout = (graph, participantId) => {
  calcLayout({
    vertices: graph.vertices()
      .map((u) => ({u, d: graph.vertex(u)}))
      .filter(({d}) => d.participants.indexOf(participantId) >= 0),
    edges: graph.edges()
      .map(([u, v]) => ({u, v, d: graph.edge(u, v)}))
      .filter(({d}) => d.participants.indexOf(participantId) >= 0),
  }, {
    vertexScale: () => 1,
    edgeScale: () => 1,
  });
};

const handleAddVertex = ({graph, textInputModal, participantId}) => {
  textInputModal.show({
    onapprove: (u) => {
      const ud = graph.vertex(u) || {text: u, participants: []};
      if (ud.participants.indexOf(participantId) < 0) {
        ud.participants = Array.from(ud.participants);
        ud.participants.push(participantId);
      }
      updateVertex(u, ud);
    },
  });
};

const handleUndo = () => {
  undo();
};

const handleRedo = () => {
  redo();
};

const handleBack = () => {
  m.route(`/projects/${m.route.param('projectId')}`);
};

const handleSave = (ctrl) => {
  ctrl.project.graph = JSON.stringify({
    vertices: ctrl.graph.vertices().map((u) => ({u, d: ctrl.graph.vertex(u)})),
    edges: ctrl.graph.edges().map(([u, v]) => ({u, v, d: ctrl.graph.edge(u, v)})),
  });
  updateProject(ctrl.project);
};

const controller = () => {
  const ctrl = {
    projectId: m.route.param('projectId'),
    participantId: m.route.param('participantId'),
    project: null,
    participant: null,
    graph: null,
    canUndo: false,
    canRedo: false,
    confirmModal: null,
    textInputModal: null,
  };

  const projectSubscription = Projects.subscribe(({type, data}) => {
    switch (type) {
      case PROJECT_GET:
        m.startComputation();
        ctrl.project = data;
        load(JSON.parse(ctrl.project.graph));
        m.endComputation();
        break;
      case PROJECT_UPDATE:
        ctrl.saved = true;
        m.route(`/projects/${ctrl.projectId}`);
        break;
    }
  });

  const participantSubscription = Participants.subscribe(({data}) => {
    m.startComputation();
    ctrl.participant = data;
    m.endComputation();
  });

  const graphSubscription = Graph.subscribe(({graph, canUndo, canRedo}) => {
    ctrl.graph = graph;
    ctrl.saved = !canUndo;
    ctrl.canUndo = canUndo;
    ctrl.canRedo = canRedo;
    layout(graph, ctrl.participantId);
  });

  ctrl.onunload = (event) => {
    if (!ctrl.saved && !confirm('保存せずに終了しますか？')) {
      event.preventDefault();
      return;
    }
    projectSubscription.dispose();
    participantSubscription.dispose();
    graphSubscription.dispose();
  };

  getProject(ctrl.projectId);
  getParticipant(ctrl.participantId);

  return ctrl;
};

const view = (ctrl) => {
  return <Fullscreen>
    <div style={{position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0}}>
      <Network graph={ctrl.graph} textInputModal={ctrl.textInputModal} participantId={ctrl.participantId}/>
    </div>
    <div style={{position: 'absolute', right: '20px', top: '60px'}}>
      <button className="ui massive circular icon button" onclick={handleBack}>
        <i className="icon arrow left"/>
      </button>
      <button className="ui secondary massive circular icon button" onclick={part(handleSave, ctrl)}>
        <i className="icon save"/>
      </button>
    </div>
    <div style={{position: 'absolute', right: '20px', bottom: '20px'}}>
      <button className="ui primary massive circular icon button" onclick={part(handleAddVertex, ctrl)}>
        <i className="icon plus"/>
      </button>
    </div>
    <div style={{position: 'absolute', left: '20px', top: '60px'}}>
      <button className={`ui large circular icon button ${ctrl.canUndo ? '' : 'disabled'}`} onclick={handleUndo}>
        <i className="icon undo"/>
      </button>
      <button className={`ui large circular icon button ${ctrl.canRedo ? '' : 'disabled'}`} onclick={handleRedo}>
        <i className="icon repeat"/>
      </button>
    </div>
    <ConfirmModal onregister={(modal) => {
      ctrl.confirmModal = modal;
    }}/>
    <TextInputModal onregister={(modal) => {
      ctrl.textInputModal = modal;
    }}/>
  </Fullscreen>
};

export default {controller, view}
