import React from 'react'
import copy from 'egraph/graph/copy'
import CycleRemovalTransformer from 'egraph/transformer/cycle-removal'
import graphToJson from '../../utils/graph-to-json'
import {
  PROJECT_GET,
  PROJECT_UPDATE
} from '../../constants'
import {updateVertex, load, undo, redo} from '../../intents/graph'
import {calcLayout} from '../../intents/layout-worker'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import Graph from '../../models/graph'
import LayoutWorker from '../../models/layout-worker'
import {getProject, updateProject} from '../../intents/project'
import {getParticipant} from '../../intents/participant'
import Fullscreen from '../common/fullscreen'
import TextInputModal from '../common/text-input-modal'
import Network from './network'

const layout = (inGraph, participantId) => {
  const graph = copy(inGraph)
  new CycleRemovalTransformer().transform(graph)
  calcLayout({
    vertices: graph.vertices()
      .map((u) => ({u, d: graph.vertex(u)}))
      .filter(({d}) => d.participants.indexOf(participantId) >= 0),
    edges: graph.edges()
      .map(([u, v]) => ({u, v, d: graph.edge(u, v)}))
      .filter(({d}) => d.participants.indexOf(participantId) >= 0)
  }, {
    layerMargin: 150,
    vertexMargin: 50,
    edgeMargin: 10,
    vertexScale: () => 1,
    edgeScale: () => 1
  })
}

class ParticipantInterview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      project: null,
      participant: null,
      graph: null,
      canUndo: false,
      canRedo: false,
      saved: true,
      vertices: [],
      edges: [],
      contentWidth: 0,
      contentHeight: 0
    }
  }

  componentDidMount () {
    const {projectId, participantId} = this.props.params

    this.context.router.setRouteLeaveHook(this.props.route, () => {
      if (!this.state.saved) {
        return '保存せずに終了しますか？'
      }
    })

    this.projectSubscription = Projects.subscribe(({type, data}) => {
      switch (type) {
        case PROJECT_GET:
          this.setState({
            project: data
          })
          load(JSON.parse(this.state.project.graph))
          break
        case PROJECT_UPDATE:
          this.setState({
            saved: true
          })
          this.context.router.push(`/projects/${projectId}`)
          break
      }
    })

    this.participantSubscription = Participants.subscribe(({data}) => {
      this.setState({
        participant: data
      })
    })

    this.graphSubscription = Graph.subscribe(({graph, canUndo, canRedo}) => {
      Object.assign(this.state, {
        graph,
        saved: !canUndo,
        canUndo,
        canRedo
      })
      layout(graph, participantId)
    })

    this.layoutSubscription = LayoutWorker.subscribe(({data}) => {
      const {vertices, edges, width, height} = data
      this.setState({
        vertices,
        edges,
        contentWidth: width,
        contentHeight: height
      })
    })

    getProject(projectId)
    getParticipant(participantId)
  }

  componentWillUnmount () {
    this.projectSubscription.unsubscribe()
    this.participantSubscription.unsubscribe()
    this.graphSubscription.unsubscribe()
    this.layoutSubscription.unsubscribe()
  }

  render () {
    const {graph, vertices, edges, contentWidth, contentHeight, canUndo, canRedo} = this.state
    const {participantId} = this.props.params
    return <Fullscreen>
      <div style={{position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0}}>
        <Network
          graph={graph}
          vertices={vertices}
          edges={edges}
          contentWidth={contentWidth}
          contentHeight={contentHeight}
          participantId={participantId} />
      </div>
      <div style={{position: 'absolute', left: '20px', top: '60px'}}>
        <button className='ui massive circular icon button' onClick={this.handleClickBackButton.bind(this)}>
          <i className='icon arrow left' />
        </button>
        <button className='ui secondary massive circular icon button' onClick={this.handleClickSaveButton.bind(this)}>
          <i className='icon save' />
        </button>
      </div>
      <div style={{position: 'absolute', right: '20px', bottom: '20px'}}>
        <button className='ui primary massive circular icon button' onClick={this.handleClickAddVertexButton.bind(this)}>
          <i className='icon plus' />
        </button>
      </div>
      <div style={{position: 'absolute', left: '20px', bottom: '20px'}}>
        <button className={`ui large circular icon button ${canUndo ? '' : 'disabled'}`} onClick={this.handleClickUndoButton.bind(this)}>
          <i className='icon undo' />
        </button>
        <button className={`ui large circular icon button ${canRedo ? '' : 'disabled'}`} onClick={this.handleClickRedoButton.bind(this)}>
          <i className='icon repeat' />
        </button>
      </div>
      <TextInputModal ref='textInputModal' onApprove={this.handleApproveTextInputModal.bind(this)} />
    </Fullscreen>
  }

  handleClickBackButton () {
    const {projectId} = this.props.params
    this.context.router.push(`/projects/${projectId}`)
  }

  handleClickSaveButton () {
    const {project, graph} = this.state
    const baseGraph = JSON.parse(project.graph)
    project.graph = JSON.stringify(Object.assign(baseGraph, graphToJson(graph)))
    updateProject(project)
  }

  handleClickAddVertexButton () {
    this.refs.textInputModal.show()
  }

  handleApproveTextInputModal (u) {
    const {graph} = this.state
    const {participantId} = this.props.params
    const ud = graph.vertex(u) || {text: u, participants: []}
    if (ud.participants.indexOf(participantId) < 0) {
      ud.participants = Array.from(ud.participants)
      ud.participants.push(participantId)
    }
    updateVertex(u, ud)
  }

  handleClickUndoButton () {
    undo()
  }

  handleClickRedoButton () {
    redo()
  }
}

ParticipantInterview.contextTypes = {
  router: React.PropTypes.object
}

export default ParticipantInterview
