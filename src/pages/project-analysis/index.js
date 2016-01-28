import m from 'mithril'
import Cache from '../common/cache'
import Fullscreen from '../common/fullscreen'
import ZoomableSvg from '../common/zoomable-svg'
import Menu from './network-menu'
import Network from './network'

const controller = () => {
  return {
    showWordcloud: true,
  };
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
    <div
        style={{
          position: 'absolute',
          right: '20px',
          bottom: '20px',
        }}>
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
