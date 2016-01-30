import m from 'mithril'
import {calcLayout} from '../../intents/layout-worker'
import {getProject} from '../../intents/project'
import Projects from '../../models/project'
import Fullscreen from '../common/fullscreen'
import Menu from './network-menu'
import Network from './network'

const controller = () => {
  const ctrl = {
    showWordcloud: true,
  };

  const projectSubscription = Projects.subscribe(({data}) => {
    m.startComputation();
    calcLayout(JSON.parse(data.graph));
    m.endComputation();
  });

  ctrl.onunload = () => {
    projectSubscription.dispose();
  };

  getProject(m.route.param('projectId'));

  return ctrl;
};

const view = (ctrl) => {
  return <Fullscreen>
    <div style={{position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0}}>
      <Network/>
    </div>
    <div style={{position: 'absolute', right: '20px', bottom: '20px'}}>
      <button
          className={'circular ui icon button toggle massive' + (ctrl.showWordcloud ? ' active' : '')}
          onclick={() => {
            ctrl.showWordcloud = !ctrl.showWordcloud;
          }}>
        <i className='icon settings'/>
      </button>
    </div>
    <Menu show={ctrl.showWordcloud}/>
  </Fullscreen>
};

export default {controller, view}
