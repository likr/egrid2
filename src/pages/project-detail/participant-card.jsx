/* global FileReader */
import React from 'react'
import {Link} from 'react-router'
import Graph from 'egraph/graph'
import {graphToJson} from '../../utils/graph-to-json'
import {jsonToGraph} from '../../utils/json-to-graph'
import {participantGraphJson} from '../../utils/participant-graph-json'
import {dataLink} from '../../utils/data-link'
import {removeParticipant, updateParticipant} from '../../intents/participant'
import {updateProject} from '../../intents/project'
import formatDate from '../utils/format-date'
import ConfirmModal from '../common/confirm-modal'
import FileSelectModal from '../common/file-select-modal'
import ParticipantModal from './participant-modal'

const merge = (graphData, inputData, participantId) => {
  const graph = new Graph()
  for (const {u, d} of graphData.vertices) {
    graph.addVertex(u, d)
  }
  for (const {u, v, d} of graphData.edges) {
    graph.addEdge(u, v, d)
  }
  if (inputData.nodes && inputData.links) {
    const indices = {}
    inputData.nodes.forEach(({text}, i) => {
      indices[i] = text
      const d = graph.vertex(text)
      if (d === null) {
        graph.addVertex(text, {text, participants: [participantId]})
      } else if (d.participants.indexOf(participantId) < 0) {
        d.participants.push(participantId)
      }
    })
    for (const {source, target} of inputData.links) {
      if (source === target) {
        continue
      }
      const u = indices[source]
      const v = indices[target]
      const d = graph.edge(u, v)
      if (d === null) {
        graph.addEdge(u, v, {participants: [participantId]})
      } else if (d.participants.indexOf(participantId) < 0) {
        d.participants.push(participantId)
      }
    }
  }
  return graphToJson(graph)
}

class ParticipantCard extends React.Component {
  render () {
    const {participant} = this.props
    return <div className='ui card'>
      <div className='content'>
        <div className='header'>
          {participant.name}
        </div>
        <div className='meta'>
          Created at:
          {formatDate(participant.created)}
        </div>
        <div className='meta'>
          Updated at:
          {formatDate(participant.updated)}
        </div>
        <div className='description'>
          {participant.note}
        </div>
      </div>
      <div className='extra content'>
        <Link className='ui secondary button' to={`/projects/${participant.projectId}/participants/${participant.id}`}>Interview</Link>
        <button
          className='ui icon button'
          data-tooltip='Edit'
          onClick={this.handleClickEdit.bind(this)}>
          <i className='icon edit' />
        </button>
        <button
          className='ui icon button'
          data-tooltip='Remove'
          onClick={this.handleClickRemove.bind(this)}>
          <i className='icon remove' />
        </button>
        <button
          className='ui icon button'
          data-tooltip='Import data'
          onClick={this.handleClickImport.bind(this)}>
          <i className='icon upload' />
        </button>
        <a
          ref='exportButton'
          className='ui icon button'
          data-tooltip='Export data'
          onClick={this.handleClickExport.bind(this)}>
          <i className='icon download' />
        </a>
      </div>
      <ConfirmModal
        ref='confirmModal'
        title='Remove Participant ?'
        text='Remove Participant ?'
        onApprove={this.handleApproveConfirmModal.bind(this)} />
      <FileSelectModal ref='fileSelectModal' title='Import Participant' onApprove={this.handleApproveFileSelectModal.bind(this)} />
      <ParticipantModal ref='participantModal' title='Update Participant' onApprove={this.handleApproveParticipantModal.bind(this)} />
    </div>
  }

  handleClickEdit () {
    const {name, note} = this.props.participant
    this.refs.participantModal.show(name, note)
  }

  handleApproveParticipantModal (data) {
    updateParticipant(Object.assign(this.props.participant, data))
  }

  handleClickRemove () {
    this.refs.confirmModal.show()
  }

  handleApproveConfirmModal () {
    const {project, participant} = this.props
    removeParticipant(participant.id)
    const data = JSON.parse(project.graph)
    for (const {d} of data.vertices) {
      const index = d.participants.indexOf(participant.id)
      if (index > -1) {
        d.participants.splice(index, 1)
      }
    }
    for (const {d} of data.edges) {
      const index = d.participants.indexOf(participant.id)
      if (index > -1) {
        d.participants.splice(index, 1)
      }
    }
    project.graph = JSON.stringify(data)
    updateProject(project)
  }

  handleClickImport () {
    this.refs.fileSelectModal.show()
  }

  handleClickExport () {
    const {project, participant} = this.props
    const data = participantGraphJson(jsonToGraph(JSON.parse(project.graph)), participant.id)
    this.refs.exportButton.href = dataLink(JSON.stringify(data))
    this.refs.exportButton.download = `${project.name}-${participant.name}.json`
  }

  handleApproveFileSelectModal (file) {
    if (file) {
      const {project, participant} = this.props
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result)
        const graph = JSON.parse(project.graph)
        project.graph = JSON.stringify(merge(graph, data, participant.id))
        updateProject(project)
      }
      reader.readAsText(file)
    }
  }
}

export default ParticipantCard
