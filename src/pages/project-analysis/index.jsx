import React from 'react'
import d3 from 'd3';
import d3cloud from 'd3-cloud'
import {Observable} from 'rx'
import {
  ANALYSIS_INIT,
  ANALYSIS_SET_THRESHOLD,
  ANALYSIS_UPDATE_PARTICIPANTS,
} from '../../constants'
import {initAnalysis} from '../../intents/analysis'
import {calcLayout} from '../../intents/layout-worker'
import {calcMorph} from '../../intents/morph-worker'
import {listParticipants} from '../../intents/participant'
import {getProject} from '../../intents/project'
import Analysis from '../../models/analysis'
import LayoutWorker from '../../models/layout-worker'
import MorphWorker from '../../models/morph-worker'
import Participants from '../../models/participant'
import Projects from '../../models/project'
import Fullscreen from '../common/fullscreen'
import Network from './network'
import FilteringThreshold from './filtering-threshold'
import ParticipantList from './participant-list'
import WordCloud from './wordcloud'

const wordCloudWidth = 300;
const wordCloudHeight = 300;

const uniqueConcat = (arr) => {
  return Array.from(new Set([].concat(...arr)));
};

const cutoff = (s, length) => {
  if (s.length <= length) {
    return s;
  }
  return s.substr(0, length - 1) + '...';
};

const parseGraph = (str) => {
  const graph = JSON.parse(str);
  if (graph.groups) {
    const vertices = {}
    for (const vertex of graph.vertices) {
      vertices[vertex.u] = vertex;
    }
    const groupVertices = graph.groups.map(({id, name, color, items}) => {
      const filteredItems = items.filter((u) => vertices[u]);
      return {
        u: `group${id}`,
        d: {
          text: name,
          color,
          items: filteredItems.map((u) => vertices[u]),
          participants: uniqueConcat(filteredItems.map((u) => vertices[u].d.participants)),
        },
      };
    });
    graph.vertices = graph.vertices
      .filter(({d}) => d.parent == undefined)
      .concat(groupVertices);
    const visitedEdges = {};
    for (const edge of graph.edges) {
      const {u, v} = edge;
      if (vertices[u].d.parent != undefined) {
        edge.u = `group${vertices[u].d.parent}`;
      }
      if (vertices[v].d.parent != undefined) {
        edge.v = `group${vertices[v].d.parent}`;
      }
      const key = `${edge.u}:${edge.v}`;
      if (visitedEdges[key]) {
        visitedEdges[key].d.participants = uniqueConcat([
          visitedEdges[key].d.participants,
          edge.d.participants]);
      } else {
        visitedEdges[key] = edge;
      }
    }
    graph.edges = Object.values(visitedEdges);
  }
  for (const vertex of graph.vertices) {
    vertex.d.text = cutoff(vertex.d.text, 10);
  }
  return graph;
};

const pos = new Set(['名詞', '動詞', '形容詞']);
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
  'わかる',
]);

const count = (data) => {
  const wordCount = new Map();
  for (const paths of data) {
    for (const path of paths) {
      const word = path.basic_form === '*' ? path.surface_form : path.basic_form;
      if (!pos.has(path.pos) || stopWords.has(word)) {
        continue;
      }
      if (!wordCount.has(word)) {
        wordCount.set(word, 0);
      }
      wordCount.set(word, wordCount.get(word) + 1);
    }
  }
  const words = Array.from(wordCount.entries()).map(([text, count]) => {
    return {text, count};
  });
  words.sort((word1, word2) => word2.count - word1.count);
  return words;
};

class ProjectAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      threshold: 0,
      vertices: [],
      edges: [],
      contentWidth: 0,
      contentHeight: 0,
      words: [],
    }
  }

  componentDidMount() {
    this.initSubscription = Observable
      .zip(Projects.map(({data}) => data), Participants.map(({data}) => data))
      .subscribe(([project, participants]) => {
        initAnalysis(parseGraph(project.graph), participants);
      });

    this.analysisSubscription = Analysis.subscribe(({type, state}) => {
      const participantIds = new Set(Object.values(state.participants)
        .filter(({checked}) => checked)
        .map(({participant}) => participant.id));
      const participantCount = (d) => {
        return d.participants ? d.participants.filter((id) => participantIds.has(id)).length : 1;
      };
      switch (type) {
        case ANALYSIS_INIT:
        case ANALYSIS_SET_THRESHOLD:
        case ANALYSIS_UPDATE_PARTICIPANTS:
          calcLayout(state.graph, {
            layerMargin: 50,
            vertexMargin: 15,
            edgeMargin: 15,
            vertexScale: ({d}) => Math.sqrt(participantCount(d)),
            edgeScale: ({d}) => participantCount(d),
          });
          break;
        default:
      }
      this.setState({
        participants: Object.values(state.participants),
        threshold: state.threshold,
      });
    });

    this.layoutWorkerSubscription = LayoutWorker.subscribe(({data}) => {
      const {vertices, edges, width, height} = data;
      this.setState({
        vertices,
        edges,
        contentWidth: width,
        contentHeight: height,
      });
      calcMorph(vertices.map(({d}) => d.text));
    });

    this.morphWorkerSubscription = MorphWorker.subscribe(({data}) => {
      const words = count(data);
      const textSize = d3.scale.linear()
        .range([10, 30])
        .domain(d3.extent(words, ({count}) => count));
      d3cloud().size([wordCloudWidth, wordCloudHeight])
        .words(words)
        .padding(1)
        .rotate(() => Math.random() * 120 - 60)
        .font('Impact')
        .fontSize((d) => textSize(d.count))
        .on('end', (layout) => {
          this.setState({
            words: layout,
          });
        })
        .start();
    });

    const {projectId} = this.props.params;
    getProject(projectId);
    listParticipants(projectId);
  }

  componentWillUnmount() {
    this.initSubscription.dispose();
    this.analysisSubscription.dispose();
    this.layoutWorkerSubscription.dispose();
    this.morphWorkerSubscription.dispose();
  }

  render() {
    const {vertices, edges, contentWidth, contentHeight, words, participants, threshold} = this.state;
    return (
      <Fullscreen>
        <div style={{position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0}}>
          <Network
              vertices={vertices}
              edges={edges}
              contentWidth={contentWidth}
              contentHeight={contentHeight}/>
        </div>
        <div style={{position: 'absolute', left: '20px', top: '60px'}}>
          <button className="ui massive circular icon button" onClick={this.handleClickBackButton.bind(this)}>
            <i className="icon arrow left"/>
          </button>
        </div>
        <div className="ui one cards" style={{position: 'absolute', top: '140px', left: '20px', width: '300px'}}>
          <ParticipantList participants={participants}/>
          <FilteringThreshold value={threshold}/>
          <WordCloud width={wordCloudWidth} height={wordCloudHeight} words={words}/>
        </div>
      </Fullscreen>
    );
  }

  handleClickBackButton() {
    const {projectId} = this.props.params;
    this.context.router.push(`/projects/${projectId}`);
  }
}

ProjectAnalysis.contextTypes = {
  router: React.PropTypes.object,
};

export default ProjectAnalysis