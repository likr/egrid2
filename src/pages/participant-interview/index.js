import m from 'mithril'
import Cache from '../common/cache'
import Fullscreen from '../common/fullscreen'
import ZoomableSvg from '../common/zoomable-svg'
import Network from './network'

const view = () => {
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
  </Fullscreen>
};

export default {view}
