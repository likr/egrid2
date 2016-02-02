import m from 'mithril'
import Cache from '../common/cache'
import Network from '../common/network'
import ZoomableSvg from '../common/zoomable-svg'
import Vertex from '../common/vertex'
import Edge from '../common/edge'

const view = () => {
  return <ZoomableSvg className="cursor-move" width="100%" height="100%" children={({x, y, scale, center}) => {
    return <g transform={`translate(${x},${y})scale(${scale})`}>
      <Cache children={(invalidate) => {
        return <Network invalidate={invalidate} center={center} children={({vertices, edges}) => {
          return <g>
            <g>{edges.map((d) => {
              return <Edge key={`${d.u}:${d.v}`} {...d}/>
            })}</g>
            <g>{vertices.map((d) => {
              return <Vertex key={d.u} {...d}/>
            })}</g>
          </g>
        }}/>
      }}/>
    </g>
  }}/>
};

export default {view}
