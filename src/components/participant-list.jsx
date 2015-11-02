/* global window */
import React from 'react'
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux'
import {pushState} from 'redux-router'
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardText from 'material-ui/lib/card/card-text'
import CardMedia from 'material-ui/lib/card/card-media'
import CardTitle from 'material-ui/lib/card/card-title'
import FlatButton from 'material-ui/lib/flat-button'
import IconButton from 'material-ui/lib/icon-button'
import RaisedButton from 'material-ui/lib/raised-button'
import Graph from 'egraph/lib/graph'
import {
  addParticipant,
  deleteParticipant,
  updateParticipant
} from '../actions/participant-actions'
import filterGraphByParticipant from '../utils/filter-graph-by-participant'
import formatDate from '../utils/format-date'
import layoutGraph from '../utils/layout-graph'
import Vertex from './vertex'
import Edge from './edge'
import ConfirmDialog from './confirm-dialog'
import ParticipantDialog from './participant-dialog'

const transform = (layout, {width, height}) => {
  const layoutLeft = Math.min(0, ...layout.vertices.map(({x, width}) => x - width / 2));
  const layoutRight = Math.max(0, ...layout.vertices.map(({x, width}) => x + width / 2));
  const layoutTop = Math.min(0, ...layout.vertices.map(({y, height}) => y - height / 2));
  const layoutBottom = Math.max(0, ...layout.vertices.map(({y, height}) => y + height / 2));
  const layoutWidth = layoutRight - layoutLeft;
  const layoutHeight = layoutBottom - layoutTop;
  const xScale = layoutWidth > 0 ? width / layoutWidth : 1;
  const yScale = layoutHeight > 0 ? height / layoutHeight : 1;
  const scale = Math.min(1, xScale, yScale);
  return {
    x: (width - layoutWidth * scale) / 2,
    y: (height - layoutHeight * scale) / 2,
    scale: scale
  };
};

const margin = 10;

class ParticipantEvaluationStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    const element = findDOMNode(this).parentNode;
    this.setState({
      width: element.clientWidth - 2 * margin,
      height: element.clientHeight - 2 * margin
    });
    this.resizeListener = ::this.handleResize;
    window.addEventListener('resize', this.resizeListener);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
  }

  render() {
    const {participantId} = this.props;
    const graph = filterGraphByParticipant(this.props.graph, participantId);
    const layout = layoutGraph(graph);
    const {x, y, scale} = transform(layout, this.state);
    return (
      <svg width="100%" height="300">
        <g transform={`translate(${margin},${margin})translate(${x},${y})scale(${scale})`}>
          <g>
            {layout.edges.map(({u, v, points, points0}) => (
              <Edge key={`${u}:${v}`} points={points} points0={points0}/>
            ))}
          </g>
          <g>
            {layout.vertices.map(({u, text, x, y, x0, y0, width, height}) => (
              <Vertex key={u} text={text} x={x} y={y} x0={x0} y0={y0} width={width} height={height}/>
            ))}
          </g>
        </g>
      </svg>
    );
  }

  handleResize() {
    const element = findDOMNode(this).parentNode;
    this.setState({
      width: element.clientWidth - 2 * margin,
      height: element.clientHeight - 2 * margin
    });
  }
}

@connect((state) => ({
  participants: state.participants,
  projects: state.projects
}))
class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participantName: ''
    };
  }

  render() {
    const {projectId} = this.props.params;
    const project = this.props.projects[projectId];
    if (!project) {
      return <div/>;
    }

    const graph = new Graph();
    const graphData = JSON.parse(project.evaluationStructure);
    for (const {u, d} of graphData.vertices) {
      graph.addVertex(u, d);
    }
    for (const {u, v, d} of graphData.edges) {
      graph.addEdge(u, v, d);
    }

    const participants = Object.keys(this.props.participants).
      map((id) => this.props.participants[id]).
      filter((participant) => participant.projectId === project.id)
    participants.sort((p1, p2) => p2.updated - p1.updated);

    return (
      <div>
        <h3>{project.name}</h3>
        <div>
          <IconButton
              iconClassName="material-icons"
              onClick={::this.handleBack}>
            arrow_back
          </IconButton>
          <IconButton
              iconClassName="material-icons"
              >
            edit
          </IconButton>
          <IconButton
              iconClassName="material-icons"
              >
            delete
          </IconButton>
          <IconButton
              iconClassName="material-icons"
              onClick={::this.handleNavigateToAnalysis}>
            open_in_new
          </IconButton>
        </div>
        <div style={{marginBottom: '16px'}}>
          <RaisedButton onClick={::this.showNewParticipantDialog} label="New" primary={true}/>
        </div>
        <div>
          {
            participants.map((participant) => {
              return (
                <div key={participant.id}>
                  <Card
                    style={{
                      marginBottom: '16px'
                    }}>
                    <CardTitle
                      title={participant.name}
                      subtitle={`Updated: ${formatDate(participant.updated)}`}/>
                    <CardText>{participant.note}</CardText>
                    <CardMedia>
                      <ParticipantEvaluationStructure graph={graph} participantId={participant.id}/>
                    </CardMedia>
                    <CardActions>
                      <FlatButton onClick={this.handleNavigateToInterview.bind(this, participant.id)} label="Interview"/>
                      <FlatButton onClick={this.handleClickDeleteButton.bind(this, participant.id)} label="Delete"/>
                      <FlatButton onClick={this.showEditParticipantDialog.bind(this, participant.id)} label="Edit"/>
                    </CardActions>
                  </Card>
                  <ParticipantDialog
                    ref={`editParticipantDialog${participant.id}`}
                    title="Edit Participant"
                    participantId={participant.id}
                    name={participant.name}
                    note={participant.note}
                    onSubmit={::this.updateParticipant}/>
                </div>
              )
            })
          }
        </div>
        <ParticipantDialog
          ref="newParticipantDialog"
          title="New Participant"
          onSubmit={::this.submitParticipant}/>
        <ConfirmDialog
          ref="deleteConfirmDialog"
          title="Delete participant"/>
      </div>
    );
  }

  showNewParticipantDialog() {
    this.refs.newParticipantDialog.show();
  }

  submitParticipant({name, note}) {
    this.props.dispatch(addParticipant({
      projectId: +this.props.params.projectId,
      name,
      note
    }));
  }

  showEditParticipantDialog(participantId) {
    this.refs[`editParticipantDialog${participantId}`].show();
  }

  updateParticipant({participantId, name, note}) {
    this.props.dispatch(updateParticipant(participantId, {
      name,
      note
    }));
  }

  handleClickDeleteButton(id) {
    this.refs.deleteConfirmDialog.show().
      then(() => {
        this.props.dispatch(deleteParticipant(id));
      }, () => {
      });
  }

  handleClickEditParticipantButton() {
    this.refs.editParticipantDialog();
  }

  handleBack() {
    this.props.dispatch(pushState(null, `/projects`));
  }

  handleNavigateToAnalysis() {
    const path = `/projects/${this.props.params.projectId}/analysis`;
    this.props.dispatch(pushState(null, path));
  }

  handleNavigateToInterview(participantId) {
    const path = `/projects/${this.props.params.projectId}/participants/${participantId}/interview`;
    this.props.dispatch(pushState(null, path));
  }
}

export default ParticipantList
