import React from 'react'
import d3 from 'd3';

const textColor = d3.scale.category20();

class Word extends React.Component {
  constructor(props) {
    super(props)
    const {x, y, rotate, size} = props;
    this.state = {
      x0: x,
      y0: y,
      rotate0: rotate,
      size0: size,
    };
  }

  componentDidMount() {
    this.transition();
  }

  componentDidUpdate() {
    this.transition();
  }

  render() {
    const {text} = this.props;
    const {x0, y0, rotate0, size0} = this.state;
    return (
      <text
          className="unselectable cursor-pointer"
          fontSize={size0}
          fontFamily='Impact'
          textAnchor='middle'
          transform={`translate(${x0},${y0})rotate(${rotate0})`}
          fill={textColor(text)}>
        {text}
      </text>
    );
  }

  transition() {
    const {x, y, rotate, size} = this.props;
    d3.select(this.refs.word)
      .transition()
      .duration(1000)
      .attr({
        fontSize: size,
        transform: `translate(${x},${y})rotate(${rotate})`,
      });
  }
}

export default Word
