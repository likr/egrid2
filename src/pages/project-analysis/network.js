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
            <g>{edges.map(({u, v, points, width, reversed, d}) => {
              return <Edge key={`${u}:${v}`} points={points} width={width} reversed={reversed} d={d}/>
            })}</g>
            <g>{vertices.map(({u, x, y, d}) => {
              return <Vertex key={u} x={x} y={y} {...d}/>
            })}</g>
          </g>
        }}/>
      }}/>
    </g>
  }}/>
};

export default {view}
