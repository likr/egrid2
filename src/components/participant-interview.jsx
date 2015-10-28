import React from 'react'
import {connect} from 'react-redux'
import {
  addVertex,
  addVertexWithEdge,
  redo,
  undo
} from '../actions/graph-actions'
import layoutGraph from '../utils/layout-graph'
import ZoomableSVG from './zoomable-svg'

const startFrom = (x, y) => {
  return `M${x} ${y}`;
};

const lineTo = (x, y) => {
  return ` L${x} ${y}`;
};

const curveTo = (x1, y1, x2, y2) => {
  const dx = x2 - x1,
        dy = y2 - y1,
        dx2 = dx / 2,
        dy2 = dy / 2,
        dx4 = dx / 4;
  return ` q${dx4} 0,${dx2} ${dy2} q${dx4} ${dy2},${dx2} ${dy2}`;
};

const svgPath = (points) => {
  const x0 = points[0][0],
        y0 = points[0][1],
        x1 = points[1][0],
        y1 = points[1][1],
        x2 = points[2][0],
        y2 = points[2][1],
        x3 = points[3][0],
        y3 = points[3][1],
        x4 = points[4][0],
        y4 = points[4][1],
        x5 = points[5][0],
        y5 = points[5][1];
  return (startFrom(x0, y0) + lineTo(x1, y1)
          + curveTo(x1, y1, x2, y2) + lineTo(x3, y3)
          + curveTo(x3, y3, x4, y4) + lineTo(x5, y5));
};

let i = 0;

@connect((state) => ({
  graph: state.graph.graph,
  canUndo: state.graph.prev !== null,
  canRedo: state.graph.next !== null
}))
class ParticipantInterview extends React.Component {
  render() {
    const layout = layoutGraph(this.props.graph);
    return (
      <div>
        <div>
          <button onClick={::this.handleAddVertex}>Add</button>
          <button disabled={!this.props.canUndo} onClick={::this.handleUndo}>Undo</button>
          <button disabled={!this.props.canRedo} onClick={::this.handleRedo}>Redo</button>
        </div>
        <div>
          <ZoomableSVG>
            <g>
              {layout.edges.map(({u, v, points}) => (
                <g key={`${u}:${v}`}>
                  <path
                      d={svgPath(points)}
                      fill="none"
                      stroke="black"
                      strokeWidth="1"/>
                </g>
              ))}
            </g>
            <g>
              {layout.vertices.map(({u, text, x, y, width, height}) => (
                <g key={u} style={{cursor: 'pointer'}} transform={`translate(${x},${y})`}>
                  <rect
                      x={-width / 2}
                      y={-height / 2}
                      rx="0"
                      width={width}
                      height={height}
                      stroke="black"
                      fill="none"/>
                  <text
                      style={{
                        userSelect: 'none',
                        MozUserSelect: 'none',
                        WebkitUserSelect: 'none',
                        MsUserSelect: 'none'
                      }}
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fontSize="10pt">
                    {text}
                  </text>
                  <foreignObject width="100" height="100">
                    <button onClick={this.handleLadderUp.bind(this, u)}>Up</button>
                    <button onClick={this.handleLadderDown.bind(this, u)}>Down</button>
                  </foreignObject>
                </g>
              ))}
            </g>
          </ZoomableSVG>
        </div>
      </div>
    );
  }

  handleAddVertex() {
    this.props.dispatch(addVertex(i++, {
      text: 'hello'
    }));
  }

  handleLadderUp(v) {
    this.props.dispatch(addVertexWithEdge({
      u: i++,
      v,
      ud: {
        text: 'up'
      },
      d: {
      }
    }));
  }

  handleLadderDown(u) {
    this.props.dispatch(addVertexWithEdge({
      u,
      v: i++,
      vd: {
        text: 'down'
      },
      d: {
      }
    }));
  }

  handleUndo() {
    this.props.dispatch(undo());
  }

  handleRedo() {
    this.props.dispatch(redo());
  }
}

export default ParticipantInterview
