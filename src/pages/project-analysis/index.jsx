import React from 'react'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import d3 from 'd3'
import d3cloud from 'd3-cloud'
import {zip} from 'rxjs'
import {map} from 'rxjs/operators'
import {initAnalysis, updateGraph} from '../../intents/analysis'
import {listParticipants} from '../../intents/participant'
import {getProject} from '../../intents/project'
import Analysis from '../../models/analysis'
import MorphWorker from '../../models/morph-worker'
import Participants from '../../models/participant'
import Projects from '../../models/project'
import Fullscreen from '../common/fullscreen'
import Network from './network'
import FilteringThreshold from './filtering-threshold'
import ParticipantList from './participant-list'
import ViewSettingModal from './view-setting-modal'
import WordCloud from './wordcloud'

const wordCloudWidth = 300
const wordCloudHeight = 500

const uniqueConcat = (arr) => {
  return Array.from(new Set([].concat(...arr)))
}

const cutoff = (s, length) => {
  if (s.length <= length) {
    return s
  }
  return s.substr(0, length - 1) + '...'
}

const parseGraph = (str, textMaxLength) => {
  const graph = JSON.parse(str)
  if (graph.groups) {
    const vertices = {}
    for (const vertex of graph.vertices) {
      vertices[vertex.u] = vertex
    }
    const groupVertices = graph.groups.map(({id, name, color, items}) => {
      const filteredItems = items.filter((u) => vertices[u])
      return {
        u: `group${id}`,
        d: {
          text: name,
          color,
          items: filteredItems.map((u) => vertices[u]),
          participants: uniqueConcat(filteredItems.map((u) => vertices[u].d.participants))
        }
      }
    })
    graph.vertices = graph.vertices
      .filter(({d}) => d.parent === undefined)
      .concat(groupVertices)
    const visitedEdges = {}
    for (const edge of graph.edges) {
      const {u, v} = edge
      if (vertices[u].d.parent !== undefined) {
        edge.u = `group${vertices[u].d.parent}`
      }
      if (vertices[v].d.parent !== undefined) {
        edge.v = `group${vertices[v].d.parent}`
      }
      const key = `${edge.u}:${edge.v}`
      if (visitedEdges[key]) {
        visitedEdges[key].d.participants = uniqueConcat([
          visitedEdges[key].d.participants,
          edge.d.participants])
      } else {
        visitedEdges[key] = edge
      }
    }
    graph.edges = Object.values(visitedEdges)
  }
  for (const vertex of graph.vertices) {
    vertex.d.text = cutoff(vertex.d.text, textMaxLength)
  }
  return graph
}

const pos = new Set(['名詞', '動詞', '形容詞'])
const stopWords = new Set([
  ' ',
  '、',
  'する',
  'れる',
  'いる',
  'やすい',
  'ある',
  'なる',
  'できる',
  'わかる'
])

const count = (data) => {
  const wordCount = new Map()
  for (const paths of data) {
    for (const path of paths) {
      const word = path.basic_form === '*' ? path.surface_form : path.basic_form
      if (!pos.has(path.pos) || stopWords.has(word)) {
        continue
      }
      if (!wordCount.has(word)) {
        wordCount.set(word, 0)
      }
      wordCount.set(word, wordCount.get(word) + 1)
    }
  }
  const words = Array.from(wordCount.entries()).map(([text, count]) => {
    return {text, count}
  })
  words.sort((word1, word2) => word2.count - word1.count)
  return words
}

class ProjectAnalysis extends React.Component {
  static get propTypes () {
    return {
      history: PropTypes.object.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.textMaxLength = 20
    this.state = {
      participants: [],
      threshold: 0,
      vertices: [],
      edges: [],
      contentWidth: 0,
      contentHeight: 0,
      words: []
    }
  }

  componentDidMount () {
    this.initSubscription = zip(Projects.pipe(map(({data}) => data)), Participants.pipe(map(({data}) => data)))
      .subscribe(([project, participants]) => {
        this.project = project
        this.participants = participants
        initAnalysis(parseGraph(project.graph, this.textMaxLength), participants)
      })

    this.analysisSubscription = Analysis.subscribe((state) => {
      const {vertices, edges, width, height} = state.layout
      this.setState({
        participants: Object.values(state.participants),
        threshold: state.threshold,
        vertices,
        edges,
        contentWidth: width,
        contentHeight: height
      })
    })

    this.morphWorkerSubscription = MorphWorker.subscribe(({data}) => {
      const words = count(data)
      const textSize = d3.scale.linear()
        .range([10, 30])
        .domain(d3.extent(words, ({count}) => count))
      d3cloud().size([wordCloudWidth, wordCloudHeight])
        .words(words)
        .padding(1)
        .rotate(() => Math.random() * 120 - 60)
        .font('Impact')
        .fontSize((d) => textSize(d.count))
        .on('end', (layout) => {
          this.setState({
            words: layout
          })
        })
        .start()
    })

    const {projectId} = this.props.match.params
    getProject(projectId)
    listParticipants(projectId)
  }

  componentWillUnmount () {
    this.initSubscription.unsubscribe()
    this.analysisSubscription.unsubscribe()
    this.morphWorkerSubscription.unsubscribe()
  }

  render () {
    const {vertices, edges, contentWidth, contentHeight, words, participants, threshold} = this.state
    return <Fullscreen>
      <div style={{position: 'absolute', top: '40px', left: 0, right: `${wordCloudWidth + 40}px`, bottom: 0}}>
        <Network
          vertices={vertices}
          edges={edges}
          contentWidth={contentWidth}
          contentHeight={contentHeight} />
      </div>
      <div style={{position: 'absolute', left: '20px', top: '60px'}}>
        <button className='ui massive circular icon button' onClick={this.handleClickBackButton.bind(this)}>
          <i className='icon arrow left' />
        </button>
        <button className='ui massive circular icon button' onClick={this.handleClickOpenViewSettingButton.bind(this)}>
          <i className='icon settings' />
        </button>
      </div>
      <div style={{position: 'absolute', top: '40px', bottom: 0, right: 0, width: `${wordCloudWidth + 40}px`, padding: '10px', boxShadow: '0 0 10px'}}>
        <div style={{height: '100%', overflowY: 'scroll'}}>
          <div style={{marginBottom: '30px'}}>
            <ParticipantList participants={participants} />
          </div>
          <div style={{marginBottom: '30px'}}>
            <FilteringThreshold value={threshold} />
          </div>
          <div style={{marginBottom: '30px'}}>
            <WordCloud width={wordCloudWidth} height={wordCloudHeight} words={words} />
          </div>
        </div>
      </div>
      <ViewSettingModal ref='viewSettingModal' onApprove={this.handleApproveViewSettingModal.bind(this)} />
    </Fullscreen>
  }

  handleClickBackButton () {
    const {projectId} = this.props.match.params
    this.props.history.push(`/projects/${projectId}`)
  }

  handleClickOpenViewSettingButton () {
    this.refs.viewSettingModal.show({
      textMaxLength: this.textMaxLength
    })
  }

  handleApproveViewSettingModal (data) {
    if (data.textMaxLength) {
      this.textMaxLength = data.textMaxLength
      updateGraph(parseGraph(this.project.graph, this.textMaxLength))
    }
  }
}

export default withRouter(ProjectAnalysis)
