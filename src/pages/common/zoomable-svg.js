import m from 'mithril'
import d3 from 'd3'

const clamp = (x, min, max) => {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
};

const minScale = 0.1;
const maxScale = 1;

const config = (ctrl) => {
  return (element, init) => {
    if (!init) {
      const zoom = d3.behavior.zoom()
        .scaleExtent([minScale, maxScale])
        .on('zoom', () => {
          const e = d3.event;
          m.startComputation();
          ctrl.x = e.translate[0];
          ctrl.y = e.translate[1];
          ctrl.scale = e.scale;
          m.endComputation();
        });
      const selection = d3.select(element).call(zoom);
      selection.on('dblclick.zoom', null);

      ctrl.element = element;
      ctrl.zoom = zoom;
    }
  }
};

const controller = () => {
  const ctrl = {
    x: 0,
    y: 0,
    scale: 1,
  };

  ctrl.center = (width, height) => {
    m.startComputation();
    const displayWidth = $(ctrl.element).width();
    const displayHeight = $(ctrl.element).height();
    const scale = clamp(Math.min(displayWidth / width, displayHeight / height), minScale, maxScale);
    const x = (displayWidth - width * scale) / 2;
    const y = (displayHeight - height * scale) / 2;
    ctrl.zoom.translate([x, y]);
    ctrl.zoom.scale(scale);
    ctrl.x = x;
    ctrl.y = y;
    ctrl.scale = scale;
    m.endComputation();
  };

  return ctrl;
};

const view = (ctrl, args) => {
  const children = args.children;
  const svgAttributes = Object.assign({}, args);
  delete svgAttributes.children;
  return <svg {...svgAttributes} style={{'background-color': '#f3f9fd'}} config={config(ctrl)}>
    {children({x: ctrl.x, y: ctrl.y, scale:ctrl.scale, center: ctrl.center})}
  </svg>
};

export default {controller, view}
