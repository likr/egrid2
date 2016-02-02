import m from 'mithril'
import d3 from 'd3';

const textColor = d3.scale.category20();

const config = (size, x, y, rotate) => {
  return (element) => {
    d3.select(element)
      .transition()
      .duration(1000)
      .attr({
        'font-size': size,
        transform: `translate(${x},${y})rotate(${rotate})`,
      });
  };
};

const controller = () => {
  return {
    size0: null,
    x0: null,
    y0: null,
    rotate0: null,
  };
};

const view = (ctrl, {text, size, x, y, rotate}) => {
  const size0 = ctrl.size0 || size;
  const x0 = ctrl.x0 || x;
  const y0 = ctrl.y0 || y;
  const rotate0 = ctrl.rotate0 || rotate;
  ctrl.size0 = size;
  ctrl.x0 = x;
  ctrl.y0 = y;
  ctrl.rotate0 = rotate;

  return <text
      config={config(size, x, y, rotate)}
      className="unselectable cursor-pointer"
      font-size={size0}
      font-family='Impact'
      text-anchor='middle'
      transform={`translate(${x0},${y0})rotate(${rotate0})`}
      fill={textColor(text)}>
    {text}
  </text>
};

export default {controller, view}
