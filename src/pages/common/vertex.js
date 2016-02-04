import m from 'mithril'
import d3 from 'd3'
import textImage from '../views/text-image'
import nop from '../../utils/nop'

const config = (x, y, scale) => {
  return (element) => {
    d3.select(element)
      .transition()
      .duration(1000)
      .attr('transform', `translate(${x},${y})scale(${scale})`);
  };
};

const controller = () => {
  return {
    x0: null,
    y0: null,
    scale0: null,
  };
};

const view = (ctrl, {text, x, y, scale, width, height, color='#fff', children=nop}) => {
  const r = 3;
  const x0 = ctrl.x0 || x;
  const y0 = ctrl.y0 || 0;
  const scale0 = ctrl.scale0 || scale;
  ctrl.x0 = x;
  ctrl.y0 = y;
  ctrl.scale0 = scale;

  return <g
      className="cursor-pointer"
      transform={`translate(${x0},${y0})scale(${scale0})`}
      config={config(x, y, scale)}>
    <rect
      x={-width / 2}
      y={-height / 2}
      rx={r}
      width={width}
      height={height}
      stroke='#888'
      fill={color}/>
    {textImage(text, width, height)}
    {children()}
  </g>
};

export default {controller, view}
