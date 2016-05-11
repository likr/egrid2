import React from 'react'
import ZoomableSvg from '../common/zoomable-svg'
import Vertex from '../common/vertex'
import Edge from '../common/edge'
import { selectVertex } from '../../intents/analysis'

const vertexColor = ({selected, upper, lower}) => {
  if (selected) {
    return '#183966'
  }
  if (upper && lower) {
    return '#9c6b19'
  }
  if (upper) {
    return '#281d6c'
  }
  if (lower) {
    return '#9c8119'
  }
  return '#888'
}

const edgeColor = (ud, vd) => {
  if (ud.upper && ud.lower && vd.upper && vd.lower) {
    return '#9c6b19'
  }
  if (ud.upper && vd.upper) {
    return '#281d6c'
  }
  if (ud.lower && vd.lower) {
    return '#9c8119'
  }
  return '#888'
}

class Network extends React.Component {
  render () {
    const {vertices, edges, contentWidth, contentHeight} = this.props
    const content = (
    <g>
      <g>
        {edges.map(({u, v, points, d, ud, vd}) => {
           return <Edge
                    key={`${u}:${v}`}
                    points={points}
                    strokeColor={edgeColor(ud, vd)}
                    {...d}/>
         })}
      </g>
      <g>
        {vertices.map(({u, x, y, d}) => {
           return <Vertex
                    key={u}
                    x={x}
                    y={y}
                    strokeColor={vertexColor(d)}
                    {...d}
                    onClick={this.handleClickVertex.bind(this, u)} />
         })}
      </g>
    </g>
    )
    return (
    <ZoomableSvg
      className="cursor-move"
      width="100%"
      height="100%"
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      children={({x, y, scale}) => {
        return <g transform={`translate(${x},${y})scale(${scale})`}>
          {content}
        </g>
        }} />
    )
  }

  handleClickVertex (u) {
    selectVertex(u)
  }
}

export default Network
