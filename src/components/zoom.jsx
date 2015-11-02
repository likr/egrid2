import React from 'react'
import {findDOMNode} from 'react-dom'
import d3 from 'd3'
import centering from '../utils/centering'

const zoom = (Component) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
        scale: 1
      };
    }

    componentDidMount() {
      const margin = 10;
      const W = this.props.width - 2 * margin;
      const H = this.props.height - 2 * margin;
      const w = this.props.contentWidth;
      const h = this.props.contentHeight;
      const {x, y, scale} = centering(w, h, W, H);

      const dom = findDOMNode(this);
      const zoom = d3.behavior.zoom()
        .translate([x, y])
        .scale(scale)
        .scaleExtent([0.1, 1])
        .on('zoom', () => {
          const {translate, scale} = d3.event;
          const [x, y] = translate;
          this.setState({x, y, scale});
        });
      d3.select(dom)
        .call(zoom);

      this.setState({x, y, scale});
    }

    render() {
      const {x, y, scale} = this.state;
      return <Component {...this.props} x={x} y={y} scale={scale}/>;
    }
  }
};

export default zoom
