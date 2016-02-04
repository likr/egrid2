import m from 'mithril'
import part from '../../utils/partial'
import {updateEdge, updateVertex, removeVertex} from '../../intents/graph'
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

const handleRemove = ({}, u) => {
  removeVertex(u);
};

const handleEdit = ({graph, textInputModal}, u) => {
  const d = graph.vertex(u);
  textInputModal.show({
    text: d.text,
    onapprove: (text) => {
      updateVertex(u, Object.assign({}, d, {text}));
    },
  });
};

const view = (ctrl, args) => {
  return <ZoomableSvg className="cursor-move" width="100%" height="100%" children={({x, y, scale, center}) => {
    return <g transform={`translate(${x},${y})scale(${scale})`}>
      <Cache children={(invalidate) => {
        return <Network invalidate={invalidate} center={center} children={({vertices, edges}) => {
          return <g>
            <g>{edges.map(({u, v, points, d}) => {
              return <Edge key={`${u}:${v}`} points={points} {...d}/>
            })}</g>
            <g>{vertices.map(({u, x, y, d}) => {
              return <Vertex key={u} x={x} y={y} {...d} children={() => {
                return <g transform="translate(0,22)">
                  <SvgButton ref="&#61536;" x="-45" y="0" onclick={part(handleLadderUp, args, d.u)}/>
                  <SvgButton ref="&#61453;" x="-15" y="0" onclick={part(handleRemove, args, d.u)}/>
                  <SvgButton ref="&#61508;" x="15" y="0" onclick={part(handleEdit, args, d.u)}/>
                  <SvgButton ref="&#61537;" x="45" y="0" onclick={part(handleLadderDown, args, d.u)}/>
                </g>
              }}/>
            })}</g>
          </g>
        }}/>
      }}/>
    </g>
  }}/>
};

export default {view}
