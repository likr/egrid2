import React from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router';
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import Graph from 'egraph/lib/graph'
import {
  addVertex,
  clearGraph,
  loadGraph,
  redo,
  undo,
  updateEdgeWithVertices,
  updateVertex
} from '../actions/graph-actions'
import {updateProject} from '../actions/project-actions'
import layoutGraph from '../utils/layout-graph'
import ZoomableSVG from './zoomable-svg'
import ConstructDialog from './construct-dialog'
import Vertex from './vertex'
import Edge from './edge'

class SvgButton extends React.Component {
  render() {
    return (
      <g style={{cursor: 'pointer'}} transform={this.props.transform} onClick={this.props.onClick}>
        <rect
            width="24"
            height="24"
            fill="#ccc"/>
        <text y="24" className="material-icons">{this.props.icon}</text>
      </g>
    );
  }
}

const nextVertexId = (graph) => {
  let maxId = -1;
  for (const u of graph.vertices()) {
    maxId = Math.max(+u, maxId);
  }
  return maxId + 1;
};

const findVertexByText = (graph, text) => {
  for (const u of graph.vertices()) {
    if (graph.vertex(u).text === text) {
      return u;
    }
  }
  return null;
};

const filterGraphByParticipant = (g, participantId) => {
  const graph = new Graph();
  for (const u of g.vertices()) {
    const d = g.vertex(u);
    if (d.participants.indexOf(participantId) > -1) {
      graph.addVertex(u, Object.assign({}, d));
    }
  }
  for (const [u, v] of g.edges()) {
    const d = g.edge(u, v);
    if (d.participants.indexOf(participantId) > -1) {
      graph.addEdge(u, v, Object.assign({}, d));
    }
  }
  return graph;
};

@connect((state) => ({
  graph: state.graph.graph,
  canUndo: state.graph.prev !== null,
  canRedo: state.graph.next !== null
}))
class ParticipantInterview extends React.Component {
  componentWillMount() {
    this.layout = {
      vertices: [],
      edges: []
    };
    const data = this.props.project.evaluationStructure || '{"vertices":[], "edges":[]}';
    this.props.dispatch(loadGraph(JSON.parse(data)));
  }

  componentWillUnmount() {
    this.props.dispatch(clearGraph());
  }

  render() {
    const participantId = +this.props.params.participantId;
    const graph = filterGraphByParticipant(this.props.graph, participantId);
    for (const {u, x, y} of this.layout.vertices) {
      const d = graph.vertex(u);
      if (d) {
        d.x = x;
        d.y = y;
      }
    }
    for (const {u, v, points} of this.layout.vertices) {
      const d = graph.edge(u, v);
      if (d) {
        d.points = points
      }
    }
    this.layout = layoutGraph(graph);
    const dur = 0.3, delay = 0.2;
    return (
      <div>
        <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 64,
              bottom: 10
            }}>
          <ZoomableSVG>
            <g>
              {this.layout.edges.map(({u, v, points, points0}) => (
                <Edge key={`${u}:${v}`} dur={dur} delay={delay} points={points} points0={points0}/>
              ))}
            </g>
            <g>
              {this.layout.vertices.map(({u, text, x, y, x0, y0, width, height}) => (
                <Vertex key={u} dur={dur} delay={delay} text={text} x={x} y={y} x0={x0} y0={y0} width={width} height={height}>
                  <g className="buttons" transform="translate(-42,0)">
                    <SvgButton
                        transform="translate(0,10)"
                        icon="arrow_back"
                        onClick={this.handleLadderUp.bind(this, u)}/>
                    <SvgButton
                        transform="translate(30,10)"
                        icon="edit"
                        onClick={this.handleEditVertex.bind(this, u)}/>
                    <SvgButton
                        transform="translate(60,10)"
                        icon="arrow_forward"
                        onClick={this.handleLadderDown.bind(this, u)}/>
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
              top: 74
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
      const graph = this.props.graph;
      const participantId = +this.props.params.participantId;
      const u = findVertexByText(graph, text);
      if (u === null) {
        this.props.dispatch(addVertex(nextVertexId(this.props.graph), {
          text,
          participants: [participantId]
        }));
      } else {
        const participants = Array.from(graph.vertex(u).participants);
        if (participants.indexOf(participantId) === -1) {
          participants.push(participantId);
          this.props.dispatch(updateVertex(u, {
            participants
          }));
        }
      }
    });
  }

  handleLadderUp(v) {
    this.refs.dialog.show((text) => {
      const graph = this.props.graph;
      const participantId = +this.props.params.participantId;
      const u = findVertexByText(graph, text) || nextVertexId(graph);
      const ud = graph.vertex(u) || {text, participants: []};
      const vd = graph.vertex(v);
      const d = graph.edge(u, v) || {participants: []};
      if (ud.participants.indexOf(participantId) === -1) {
        ud.participants.push(participantId);
      }
      if (d.participants.indexOf(participantId) === -1) {
        d.participants.push(participantId);
      }
      this.props.dispatch(updateEdgeWithVertices({u, v, ud, vd, d}));
    });
  }

  handleLadderDown(u) {
    this.refs.dialog.show((text) => {
      const graph = this.props.graph;
      const participantId = +this.props.params.participantId;
      const v = findVertexByText(graph, text) || nextVertexId(graph);
      const vd = graph.vertex(v) || {text, participants: []};
      const ud = graph.vertex(u);
      const d = graph.edge(u, v) || {participants: []};
      if (vd.participants.indexOf(participantId) === -1) {
        vd.participants.push(participantId);
      }
      if (d.participants.indexOf(participantId) === -1) {
        d.participants.push(participantId);
      }
      this.props.dispatch(updateEdgeWithVertices({u, v, ud, vd, d}));
    });
  }

  handleEditVertex() {
  }

  handleUndo() {
    this.props.dispatch(undo());
  }

  handleRedo() {
    this.props.dispatch(redo());
  }

  handleSave() {
    const {projectId} = this.props.params;
    this.props.dispatch(updateProject(projectId, {
      evaluationStructure: this.props.graph.toString()
    }));
    this.props.dispatch(pushState(null, `/projects/${projectId}/participants`));
  }
}

@connect((state) => ({
  projects: state.projects
}))
class ParticipantInterviewWrapper extends React.Component {
  render() {
    const {projectId} = this.props.params;
    const project = this.props.projects[projectId];
    return project ? <ParticipantInterview params={this.props.params} project={project}/> : <div/>;
  }
}

export default ParticipantInterviewWrapper
