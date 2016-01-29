/* global confirm */
import m from 'mithril'
import part from '../../utils/partial'
import {
  PROJECT_GET,
  PROJECT_UPDATE,
} from '../../constants'
import {addVertex, load, undo, redo} from '../../intents/graph'
import {calcLayout} from '../../intents/layout-worker'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import Graph from '../../models/graph'
import {getProject, updateProject} from '../../intents/project'
import {getParticipant} from '../../intents/participant'
import Cache from '../common/cache'
import ConfirmModal from '../common/confirm-modal'
import Fullscreen from '../common/fullscreen'
import TextInputModal from '../common/text-input-modal'
import ZoomableSvg from '../common/zoomable-svg'
import Network from './network'

const toJSON = (graph) => {
  const data = {};
  data.vertices = graph.vertices().map((u) => ({u, d: graph.vertex(u)}));
  data.edges = graph.edges().map(([u, v]) => ({u, v, d: graph.edge(u, v)}));
  return data;
};

const handleAddVertex = (ctrl) => {
  ctrl.textInputModal.show({
    onapprove: (text) => {
      addVertex(text, {
        text,
        width: 80,
        height: 20,
      });
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
  ctrl.project.graph = JSON.stringify(ctrl.graph);
  updateProject(ctrl.project);
};

const controller = () => {
  const ctrl = {
    project: null,
    participant: null,
    graph: null,
    canUndo: false,
    canRedo: false,
    confirmModal: null,
    textInputModal: null,
  };

  const projectId = m.route.param('projectId');
  const participantId = m.route.param('participantId');

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
        m.route(`/projects/${projectId}`);
        break;
    }
  });

  const participantSubscription = Participants.subscribe((participant) => {
    m.startComputation();
    ctrl.participant = participant;
    m.endComputation();
  });

  const graphSubscription = Graph.subscribe(({graph, canUndo, canRedo}) => {
    ctrl.graph = toJSON(graph);
    ctrl.saved = !canUndo;
    ctrl.canUndo = canUndo;
    ctrl.canRedo = canRedo;
    calcLayout(ctrl.graph);
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

  getProject(projectId);
  getParticipant(projectId, participantId);

  return ctrl;
};

const view = (ctrl) => {
  return <Fullscreen>
    <div style={{
      position: 'absolute',
      top: '40px',
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <ZoomableSvg className="cursor-move" width="100%" height="100%" children={({x, y, scale}) => {
        return <g transform={`translate(${x},${y})scale(${scale})`}>
          <Cache children={(invalidate) => {
            return <Network invalidate={invalidate}/>
          }}/>
        </g>
      }}/>
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
