import m from 'mithril'
import part from '../../utils/partial'
import {addEdge, addVertexToLower, addVertexToUpper} from '../../intents/graph'
import Cache from '../common/cache'
import Network from '../common/network'
import ZoomableSvg from '../common/zoomable-svg'
import vertex from '../views/vertex'
import edge from '../views/edge'

const handleLadderUp = ({graph, textInputModal, participantId}, v) => {
  textInputModal.show({
    onapprove: (text) => {
      const d = {participants: [participantId]};
      if (graph.vertex(text)) {
        addEdge(text, v, d);
      } else {
        const ud = {text, participants: [participantId], width: 80, height: 20};
        addVertexToUpper(text, v, ud, d);
      }
    },
  });
};

const handleLadderDown = ({graph, textInputModal, participantId}, u) => {
  textInputModal.show({
    onapprove: (text) => {
      const d = {participants: [participantId]};
      if (graph.vertex(text)) {
        addEdge(u, text, d);
      } else {
        const vd = {text, participants: [participantId], width: 80, height: 20};
        addVertexToLower(u, text, vd, d);
      }
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
