import m from 'mithril'
import Cache from '../common/cache'
import Network from '../common/network'
import ZoomableSvg from '../common/zoomable-svg'
import vertex from '../views/vertex'
import edge from '../views/edge'

const view = () => {
  return <ZoomableSvg caassName="cursor-move" width="100%" height="100%" children={({x, y, scale}) => {
    return <g transform={`translate(${x},${y})scale(${scale})`}>
      <Cache children={(invalidate) => {
        return <Network invalidate={invalidate} children={({vertices, edges}) => {
          return <g>
            <g>{edges.map(edge)}</g>
            <g>{vertices.map(vertex)}</g>
          </g>
        }}/>
      }}/>
    </g>
  }}/>
};

export default {view}
