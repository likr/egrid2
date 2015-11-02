import React from 'react'
import {connect} from 'react-redux'
import copy from 'egraph/lib/graph/copy'
import {
  clearGraph,
  loadGraph
} from '../actions/graph-actions'
import layoutGraph from '../utils/layout-graph'
import layoutRegion from '../utils/layout-region'
import Vertex from './vertex'
import Edge from './edge'
import zoom from './zoom'
import injectBBox from './inject-bbox'

@injectBBox
@zoom
class ProjectAnalysisSvg extends React.Component {
  render() {
    const dur = 0.3, delay = 0.2;
    const {x, y, scale} = this.props;
    return (
      <svg width="100%" height="100%" style={{cursor: 'move'}}>
        <g transform={`translate(${x},${y})scale(${scale})`}>
          <g>
            {this.props.layout.edges.map(({u, v, points, points0}) => (
              <Edge key={`${u}:${v}`} dur={dur} delay={delay} points={points} points0={points0}/>
            ))}
          </g>
          <g>
            {this.props.layout.vertices.map(({u, text, x, y, x0, y0, width, height}) => (
              <Vertex key={u} dur={dur} delay={delay} text={text} x={x} y={y} x0={x0} y0={y0} width={width} height={height}/>
            ))}
          </g>
        </g>
      </svg>
    );
  }
}

@connect((state) => ({
  graph: state.graph.graph
}))
class ProjectAnalysis extends React.Component {
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
    const graph = copy(this.props.graph);
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
    const region = layoutRegion(this.layout);

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
          <ProjectAnalysisSvg
            layout={this.layout}
            contentWidth={region.width}
            contentHeight={region.height}/>
        </div>
      </div>
    );
  }
}

@connect((state) => ({
  projects: state.projects
}))
class ProjectAnalysisWrapper extends React.Component {
  render() {
    const {projectId} = this.props.params;
    const project = this.props.projects[projectId];
    return project ? <ProjectAnalysis params={this.props.params} project={project}/> : <div/>;
  }
}

export default ProjectAnalysisWrapper
