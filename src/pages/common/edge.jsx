import React from 'react'
import d3 from 'd3'

const startFrom = (x, y) => {
  return `M${x} ${y}`;
};

const lineTo = (x, y) => {
  return ` L${x} ${y}`;
};

const curveTo = (x1, y1, x2, y2) => {
  const dx = x2 - x1,
        dy = y2 - y1,
        dx2 = dx / 2,
        dy2 = dy / 2,
        dx4 = dx / 4;
  return ` q${dx4} 0,${dx2} ${dy2} q${dx4} ${dy2},${dx2} ${dy2}`;
};

const svgPath = (points) => {
  const x0 = points[0][0],
        y0 = points[0][1],
        x1 = points[1][0],
        y1 = points[1][1],
        x2 = points[2][0],
        y2 = points[2][1],
        x3 = points[3][0],
        y3 = points[3][1],
        x4 = points[4][0],
        y4 = points[4][1],
        x5 = points[5][0],
        y5 = points[5][1];
  return (startFrom(x0, y0) + lineTo(x1, y1)
          + curveTo(x1, y1, x2, y2) + lineTo(x3, y3)
          + curveTo(x3, y3, x4, y4) + lineTo(x5, y5));
};

class Edge extends React.Component {
  constructor(props) {
    super(props);
    const {points, width} = props;
    this.state = {
      points0: points.map(([x]) => [x, 0]),
      width0: width,
    };
  }

  componentWillReceiveProps() {
    const {points, width} = this.props;
    this.setState({
      points0: points,
      width0: width,
    });
  }

  componentDidMount() {
    this.transition();
  }

  componentDidUpdate() {
    this.transition();
  }

  render() {
    const {reversed, strokeColor} = this.props;
    const {points0, width0} = this.state;
    return (
      <g ref="edge">
        <path
            fill='none'
            stroke={strokeColor || '#888'}
            strokeWidth={width0}
            strokeDasharray={reversed ? 5 : 0}
            d={svgPath(points0)}
        />
      </g>
    );
  }

  transition() {
    const {points, width} = this.props;
    d3.select(this.refs.edge)
      .select('path')
      .transition()
      .duration(1000)
      .attr({
        d: svgPath(points),
        strokeWidth: width,
      });
  }
}

export default Edge
