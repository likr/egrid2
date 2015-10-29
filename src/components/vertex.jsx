import React from 'react'
import {findDOMNode} from 'react-dom'
import {animateTransform} from '../utils/shinsekai';

class Vertex extends React.Component {
  componentDidMount() {
    const {x, y, x0, y0} = this.props;
    animateTransform(findDOMNode(this), {
      type: 'translate',
      from: `${x0} ${y0}`,
      to: `${x} ${y}`,
      dur: this.props.dur,
      delay: this.props.delay
    });
  }

  componentDidUpdate(prevProps) {
    const {x, y, x0, y0} = this.props;
    if (x !== prevProps.x || y !== prevProps.y) {
      this.clearAnimateElements();
      const element = findDOMNode(this);
      animateTransform(element, {
        type: 'translate',
        from: `${x0} ${y0}`,
        to: `${x} ${y}`,
        dur: this.props.dur,
        delay: this.props.delay
      });
    }
  }

  componentWillUnMount() {
    this.clearAnimateElements();
  }

  render() {
    const {text, x0, y0, width, height} = this.props;
    return (
      <g transform={`translate(${x0},${y0})`}>
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

  clearAnimateElements() {
    const element = findDOMNode(this);
    for (let i = 0; i < element.children.length; ++i) {
      const child = element.children[i];
      if (child.tagName === 'animate') {
        element.removeChild(child);
      }
    }
  }
}

export default Vertex
