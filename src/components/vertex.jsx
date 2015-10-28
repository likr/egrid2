import React from 'react'

class Vertex extends React.Component {
  render() {
    const {text, x, y, width, height} = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <g style={{cursor: 'pointer'}}>
          <rect
              x={-width / 2}
              y={-height / 2}
              rx="0"
              width={width}
              height={height}
              stroke="black"
              fill="none"/>
          <text
              style={{
                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                MsUserSelect: 'none'
              }}
              x="0"
              y="5"
              textAnchor="middle"
              fontSize="10pt">
            {text}
          </text>
        </g>
        {this.props.children}
      </g>
    );
  }
}

export default Vertex
