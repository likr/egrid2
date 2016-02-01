import m from 'mithril'
import {calcLayout} from '../../intents/layout-worker'
import {getProject} from '../../intents/project'
import {listParticipants} from '../../intents/participant'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import Fullscreen from '../common/fullscreen'
import Menu from './network-menu'
import Network from './network'
import ParticipantList from './participant-list'

const handleBack = () => {
  m.route(`/projects/${m.route.param('projectId')}`);
};

const controller = () => {
  const ctrl = {
    showWordcloud: true,
    participants: [],
  };

  const projectSubscription = Projects.subscribe(({data}) => {
    m.startComputation();
    calcLayout(JSON.parse(data.graph), {
      layerMargin: 100,
      vertexMargin: 10,
      edgeMargin: 5,
      vertexScale: ({d}) => d.participants.length,
      edgeScale: ({d}) => d.participants.length,
    });
    m.endComputation();
  });

  const participantSubscription = Participants.subscribe(({data}) => {
    m.startComputation();
    ctrl.participants = data.map((participant) => ({participant, checked: true}));
    m.endComputation();
  });

  ctrl.onunload = () => {
    projectSubscription.dispose();
    participantSubscription.dispose();
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
    <div style={{position: 'absolute', right: '20px', bottom: '20px'}}>
      <button className="ui massive circular icon button" onclick={handleBack}>
        <i className="icon arrow left"/>
      </button>
      <button
          className={'circular ui icon button toggle massive' + (ctrl.showWordcloud ? ' active' : '')}
          onclick={() => {
            ctrl.showWordcloud = !ctrl.showWordcloud;
          }}>
        <i className='icon settings'/>
      </button>
    </div>
    <Menu show={ctrl.showWordcloud}/>
    <ParticipantList participants={ctrl.participants}/>
  </Fullscreen>
};

export default {controller, view}
