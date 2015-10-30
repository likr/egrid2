import React from 'react'
import {findDOMNode} from 'react-dom'
import {animate} from '../utils/shinsekai';

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
  componentDidMount() {
    const {points, dur, delay} = this.props;
    if (dur > 0 && delay > 0) {
      animate(findDOMNode(this).firstChild, {
        attributeName: 'd',
        to: svgPath(points),
        dur,
        delay
      });
    }
  }

  componentDidUpdate() {
    const {points, dur, delay} = this.props;
    if (dur > 0 && delay > 0) {
      this.clearAnimateElements();
      animate(findDOMNode(this).firstChild, {
        attributeName: 'd',
        to: svgPath(points),
        dur,
        delay
      });
    }
  }

  componentWillUnMount() {
    this.clearAnimateElements();
  }

  render() {
    const {points, points0, dur, delay} = this.props;
    const useAnimate = dur > 0 && delay > 0;
    return (
      <g>
        <path
            d={svgPath(useAnimate ? points0 : points)}
            fill="none"
            stroke="black"
            strokeWidth="1"/>
      </g>
    );
  }

  clearAnimateElements() {
    const element = findDOMNode(this).firstChild;
    for (let i = 0; i < element.children.length; ++i) {
      const child = element.children[i];
      if (child.tagName === 'animate') {
        element.removeChild(child);
      }
    }
  }
}

export default Edge
