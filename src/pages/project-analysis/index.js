import m from 'mithril'
import {Observable} from 'rx'
import {
  ANALYSIS_INIT,
  ANALYSIS_SET_THRESHOLD,
  ANALYSIS_UPDATE_PARTICIPANTS,
} from '../../constants'
import {initAnalysis} from '../../intents/analysis'
import {calcLayout} from '../../intents/layout-worker'
import {getProject} from '../../intents/project'
import {listParticipants} from '../../intents/participant'
import Analysis from '../../models/analysis'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import Fullscreen from '../common/fullscreen'
import popup from '../utils/config-popup'
import Menu from './network-menu'
import Network from './network'
import FilteringThreshold from './filtering-threshold'
import ParticipantList from './participant-list'

const handleBack = () => {
  m.route(`/projects/${m.route.param('projectId')}`);
};

const controller = () => {
  const ctrl = {
    showWordcloud: true,
    participants: [],
    threshold: 0,
  };

  const initSubscription = Observable
    .zip(Projects.map(({data}) => data), Participants.map(({data}) => data))
    .subscribe(([project, participants]) => {
      initAnalysis(JSON.parse(project.graph), participants);
    });

  const analysisSubscription = Analysis.subscribe(({type, state}) => {
    const participantIds = new Set(Object.values(state.participants)
      .filter(({checked}) => checked)
      .map(({participant}) => participant.id));
    const participantCount = (d) => {
      return d.participants ? d.participants.filter((id) => participantIds.has(id)).length : 1;
    };
    switch (type) {
      case ANALYSIS_INIT:
      case ANALYSIS_SET_THRESHOLD:
      case ANALYSIS_UPDATE_PARTICIPANTS:
        calcLayout(state.graph, {
          layerMargin: 50,
          vertexMargin: 10,
          edgeMargin: 5,
          vertexScale: ({d}) => participantCount(d),
          edgeScale: ({d}) => participantCount(d),
        });
        break;
      default:
    }
    m.startComputation();
    ctrl.participants = Object.values(state.participants);
    ctrl.threshold = state.threshold;
    m.endComputation();
  });

  ctrl.onunload = () => {
    initSubscription.dispose();
    analysisSubscription.dispose();
  };

  const projectId = m.route.param('projectId');
  getProject(projectId);
  listParticipants(projectId);

  return ctrl;
};

const view = (ctrl) => {
  return <Fullscreen>
    <div style={{position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0}}>
      <Network/>
    </div>
    <div style={{position: 'absolute', left: '20px', top: '60px'}}>
      <button className="ui massive circular icon button" onclick={handleBack}>
        <i className="icon arrow left"/>
      </button>
      <button
          config={popup}
          data-content="Toggle Menu"
          className={'circular ui icon button toggle massive' + (ctrl.showWordcloud ? ' active' : '')}
          onclick={() => {
            ctrl.showWordcloud = !ctrl.showWordcloud;
          }}>
        <i className='icon settings'/>
      </button>
    </div>
    <Menu show={ctrl.showWordcloud}/>
    <div className="ui one cards" style={{position: 'absolute', top: '140px', left: '20px', width: '300px'}}>
      <ParticipantList show={ctrl.showWordcloud} participants={ctrl.participants}/>
      <FilteringThreshold show={ctrl.showWordcloud} value={ctrl.threshold}/>
    </div>
  </Fullscreen>
};

export default {controller, view}
