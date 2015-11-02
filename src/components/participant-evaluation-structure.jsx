import React from 'react'
import filterGraphByParticipant from '../utils/filter-graph-by-participant'
import centering from '../utils/centering'
import layoutGraph from '../utils/layout-graph'
import layoutRegion from '../utils/layout-region'
import Vertex from './vertex'
import Edge from './edge'
import injectBBox from './inject-bbox'


@injectBBox
class ParticipantEvaluationStructure extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const margin = 10;
    const {participantId, styleWidth, styleHeight} = this.props;
    const graph = filterGraphByParticipant(this.props.graph, participantId);
    const layout = layoutGraph(graph);
    const W = this.props.width - 2 * margin;
    const H = this.props.height - 2 * margin;
    const region = layoutRegion(layout);
    const w = region.width;
    const h = region.height;
    const {x, y, scale} = centering(w, h, W, H);
    return (
      <svg width={styleWidth} height={styleHeight}>
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
}

export default ParticipantEvaluationStructure
