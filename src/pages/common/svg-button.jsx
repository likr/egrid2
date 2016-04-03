import React from 'react'

class SvgButton extends React.Component {
  render() {
    const {code, x, y, onClick} = this.props;
    return (
      <g className="cursor-pointer" transform={`translate(${x},${y})`} onClick={onClick}>
        <circle r="10" fill="#e0e1e2"/>
        <text
            fontFamily="Icons"
            fill="black"
            opacity="0.6"
            textAnchor="middle"
            y={5}>
          {code}
        </text>
      </g>
    );
  }
}

export default SvgButton
