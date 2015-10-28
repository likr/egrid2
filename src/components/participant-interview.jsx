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
import Vertex from './vertex'
import Edge from './edge'

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
              left: 0,
              right: 0,
              top: 0,
              bottom: 10
            }}>
          <ZoomableSVG>
            <g>
              {layout.edges.map(({u, v, points}) => <Edge key={`${u}:${v}`} points={points}/>)}
            </g>
            <g>
              {layout.vertices.map(({u, text, x, y, width, height}) => (
                <Vertex key={u} text={text} x={x} y={y} width={width} height={height}>
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
                </Vertex>
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
              top: 10
            }}>
          <FloatingActionButton
              secondary={true}
              onClick={::this.handleSave}>
              <FontIcon className="material-icons">save</FontIcon>
          </FloatingActionButton>
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

  handleSave() {
  }
}

export default ParticipantInterview
