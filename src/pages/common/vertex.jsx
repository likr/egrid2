import React from 'react'
import d3 from 'd3'
import TextImage from '../views/text-image'

const nop = () => {};

class Vertex extends React.Component {
  constructor(props) {
    super(props);
    const {x, scale} = props;
    this.state = {
      x0: x,
      y0: 0,
      scale0: scale,
    };
  }

  componentWillReceiveProps() {
    const {x, y, scale} = this.props;
    this.setState({
      x0: x,
      y0: y,
      scale0: scale,
    });
  }

  componentDidMount() {
    this.transition();
  }

  componentDidUpdate() {
    this.transition();
  }

  render() {
    const r = 3;
    const {width, height, color, strokeColor, text, children, onClick, selected} = this.props;
    const {x0, y0, scale0} = this.state;
    return (
      <g
          ref="vertex"
          className="cursor-pointer"
          onClick={onClick || nop}
          transform={`translate(${x0},${y0})scale(${scale0})`}>
        <rect
            x={-width / 2}
            y={-height / 2}
            rx={r}
            width={width}
            height={height}
            stroke={strokeColor || '#888'}
            strokeWidth={selected ? 2 : 1}
            fill={color || '#fff'}/>
        <TextImage
            text={text}
            width={width}
            height={height}/>
        {children}
      </g>
    );
  }

  transition() {
    const {x, y, scale} = this.props;
    d3.select(this.refs.vertex)
      .transition()
      .duration(1000)
      .attr('transform', `translate(${x},${y})scale(${scale})`);
  }
}

export default Vertex
