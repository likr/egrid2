import m from 'mithril'
import part from '../../utils/partial'
import {updateEdge} from '../../intents/graph'
import Cache from '../common/cache'
import Network from '../common/network'
import SvgButton from '../common/svg-button'
import ZoomableSvg from '../common/zoomable-svg'
import Vertex from '../common/vertex'
import Edge from '../common/edge'

const handleLadderUp = ({graph, textInputModal, participantId}, v) => {
  textInputModal.show({
    onapprove: (u) => {
      const d = graph.edge(u, v) || {
        participants: [],
      };
      if (d.participants.indexOf(participantId) < 0) {
        d.participants = Array.from(d.participants);
        d.participants.push(participantId);
      }
      const ud = graph.vertex(u) || {text: u, participants: []};
      if (ud.participants.indexOf(participantId) < 0) {
        ud.participants = Array.from(ud.participants);
        ud.participants.push(participantId);
      }
      const vd = graph.vertex(v);
      updateEdge(u, v, ud, vd, d);
    },
  });
};

const handleLadderDown = ({graph, textInputModal, participantId}, u) => {
  textInputModal.show({
    onapprove: (v) => {
      const d = graph.edge(u, v) || {
        participants: [],
      };
      if (d.participants.indexOf(participantId) < 0) {
        d.participants = Array.from(d.participants);
        d.participants.push(participantId);
      }
      const ud = graph.vertex(u);
      const vd = graph.vertex(v) || {text: v, participants: []};
      if (vd.participants.indexOf(participantId) < 0) {
        vd.participants = Array.from(vd.participants);
        vd.participants.push(participantId);
      }
      updateEdge(u, v, ud, vd, d);
    },
  });
};

const view = (ctrl, args) => {
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
            <g>{vertices.map(({u, x, y, height}) => {
              return <g transform={`translate(${x},${y})`}>
                <SvgButton ref="&#61536;" x={-30} y={height / 2 + 12} onclick={part(handleLadderUp, args, u)}/>
                <SvgButton ref="&#61453;" x={0} y={height / 2 + 12} onclick={() => {}}/>
                <SvgButton ref="&#61537;" x={30} y={height / 2 + 12} onclick={part(handleLadderDown, args, u)}/>
              </g>
            })}</g>
          </g>
        }}/>
      }}/>
    </g>
  }}/>
};

export default {view}
