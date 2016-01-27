import m from 'mithril'
import Fullscreen from '../common/fullscreen'
import D3zoom from './d3zoom'
import Menu from './network-menu'
import content from './content'

const controller = () => {
  return {
    showWordcloud: true,
  };
};

const view = (ctrl) => {
  return <Fullscreen>
    <div
        style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
      <D3zoom
          selector='svg[width=100%][height=100%]'
          attributes={{
            style: {
              cursor: 'move',
              display: 'block',
            },
          }}
          childComponent={content}
          disableDblclick={true}/>
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
