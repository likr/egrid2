/* global window */
import React from 'react'
import {findDOMNode} from 'react-dom'
import filterGraphByParticipant from '../utils/filter-graph-by-participant'
import layoutGraph from '../utils/layout-graph'
import Vertex from './vertex'
import Edge from './edge'

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

export default ParticipantEvaluationStructure
