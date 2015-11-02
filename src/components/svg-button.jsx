import React from 'react'

class SvgButton extends React.Component {
  render() {
    return (
      <g style={{cursor: 'pointer'}} transform={this.props.transform} onClick={this.props.onClick}>
        <rect
            width="24"
            height="24"
            fill="#ccc"/>
        <text y="24" className="material-icons">{this.props.icon}</text>
      </g>
    );
  }
}

export default SvgButton
