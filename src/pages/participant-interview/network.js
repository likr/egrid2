import m from 'mithril'
import part from '../../utils/partial'
import {updateEdge} from '../../intents/graph'
import Cache from '../common/cache'
import Network from '../common/network'
import ZoomableSvg from '../common/zoomable-svg'
import vertex from '../views/vertex'
import edge from '../views/edge'

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
      const ud = graph.vertex(u) || {
        text: u,
        participants: [],
        width: 80,
        height: 20,
      };
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
      const vd = graph.vertex(v) || {
        text: v,
        participants: [],
        width: 80,
        height: 20,
      };
      if (vd.participants.indexOf(participantId) < 0) {
        vd.participants = Array.from(vd.participants);
        vd.participants.push(participantId);
      }
      updateEdge(u, v, ud, vd, d);
    },
  });
};

const controller = ({graph}) => {
  return {graph, participantId: m.route.param('participantId')};
};

const view = (ctrl, args) => {
  return <ZoomableSvg caassName="cursor-move" width="100%" height="100%" children={({x, y, scale}) => {
    return <g transform={`translate(${x},${y})scale(${scale})`}>
      <Cache children={(invalidate) => {
        return <Network invalidate={invalidate} children={({vertices, edges}) => {
          return <g>
            <g>{edges.map(edge)}</g>
            <g>{vertices.map(vertex)}</g>
            <g>{vertices.map(({u, x, y}) => {
              return <g transform={`translate(${x},${y})`}>
                <circle className="cursor-pointer" cx="-30" cy="30" r="10" onclick={part(handleLadderUp, args, u)}/>
                <circle className="cursor-pointer" cx="30" cy="30" r="10" onclick={part(handleLadderDown, args, u)}/>
              </g>
            })}</g>
          </g>
        }}/>
      }}/>
    </g>
  }}/>
};

export default {controller, view}
