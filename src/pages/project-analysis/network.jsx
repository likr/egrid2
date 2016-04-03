import React from 'react'
import ZoomableSvg from '../common/zoomable-svg'
import Vertex from '../common/vertex'
import Edge from '../common/edge'

class Network extends React.Component {
  render() {
    const {vertices, edges, contentWidth, contentHeight} = this.props;
    const content = (
      <g>
        <g>{edges.map(({u, v, points, d}) => {
          return <Edge key={`${u}:${v}`} points={points} {...d}/>
        })}</g>
        <g>{vertices.map(({u, x, y, d}) => {
          return <Vertex key={u} x={x} y={y} {...d}/>
        })}</g>
      </g>
    );
    return (
      <ZoomableSvg
          className="cursor-move"
          width="100%"
          height="100%"
          contentWidth={contentWidth}
          contentHeight={contentHeight}
          children={({x, y, scale}) => {
            return <g transform={`translate(${x},${y})scale(${scale})`}>{content}</g>
          }}
      />
    );
  }
}

export default Network
