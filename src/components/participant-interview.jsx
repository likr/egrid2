import React from 'react'
import {connect} from 'react-redux'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import {
  addVertex,
  addVertexWithEdge,
  redo,
  undo
} from '../actions/graph-actions'
import layoutGraph from '../utils/layout-graph'
import ZoomableSVG from './zoomable-svg'
import ConstructDialog from './construct-dialog'

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
        <div
            style={{
              position: 'absolute',
              left: 5,
              right: 5,
              top: 5,
              bottom: 5
            }}>
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
                <g key={u} transform={`translate(${x},${y})`}>
                  <g style={{cursor: 'pointer'}}>
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
                  </g>
                  <g transform="translate(-48,0)">
                    <foreignObject width="98" height="48">
                      <IconButton
                          iconClassName="material-icons"
                          onClick={this.handleLadderUp.bind(this, u)}>
                        arrow_back
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          onClick={this.handleLadderDown.bind(this, u)}>
                        arrow_forward
                      </IconButton>
                    </foreignObject>
                  </g>
                </g>
              ))}
            </g>
          </ZoomableSVG>
        </div>
        <div
            style={{
              position: 'absolute',
              left: 10,
              bottom: 10
            }}>
          <IconButton
              iconClassName="material-icons"
              disabled={!this.props.canUndo}
              onClick={::this.handleUndo}>
            undo
          </IconButton>
          <IconButton
              iconClassName="material-icons"
              disabled={!this.props.canRedo}
              onClick={::this.handleRedo}>
            redo
          </IconButton>
        </div>
        <div
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10
            }}>
          <FloatingActionButton
              onClick={::this.handleAddVertex}>
              <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
        </div>
        <ConstructDialog ref="dialog"/>
      </div>
    );
  }

  handleAddVertex() {
    this.refs.dialog.show((text) => {
      this.props.dispatch(addVertex(i++, {text}));
    });
  }

  handleLadderUp(v) {
    this.refs.dialog.show((text) => {
      this.props.dispatch(addVertexWithEdge({
        u: i++,
        v,
        ud: {text},
        d: {}
      }));
    });
  }

  handleLadderDown(u) {
    this.refs.dialog.show((text) => {
      this.props.dispatch(addVertexWithEdge({
        u,
        v: i++,
        vd: {text},
        d: {}
      }));
    });
  }

  handleUndo() {
    this.props.dispatch(undo());
  }

  handleRedo() {
    this.props.dispatch(redo());
  }
}

export default ParticipantInterview
