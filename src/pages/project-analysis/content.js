import m from 'mithril'
import Network from './network'

const view = (ctrl, args) => {
  return <g transform={`translate(${args.x},${args.y})scale(${args.scale})`}>
    <Network/>
  </g>
}

export default {view}
