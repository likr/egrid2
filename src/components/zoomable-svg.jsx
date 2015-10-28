import React from 'react'
import {findDOMNode} from 'react-dom'
import d3 from 'd3'

class ZoomableSVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      scale: 1
    };
  }

  componentDidMount() {
    const dom = findDOMNode(this);
    const zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', () => {
        const {translate, scale} = d3.event;
        const [x, y] = translate;
        this.setState({x, y, scale});
      });
    d3.select(dom)
      .call(zoom);
  }

  render() {
    const {x, y, scale} = this.state;
    return (
      <svg width="100%" height="100%" style={{cursor: 'move'}}>
        <g transform={`translate(${x},${y})scale(${scale})`}>
          {this.props.children}
        </g>
      </svg>
    );
  }
}

export default ZoomableSVG
