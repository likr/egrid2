import m from 'mithril'
import d3 from 'd3'

const config = (ctrl) => {
  return (element, init) => {
    if (!init) {
      const zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 1])
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
    }
  }
};

const controller = () => ({
    x: 0,
    y: 0,
    scale: 1,
  });

const view = (ctrl, args) => {
  return <svg {...args} config={config(ctrl)}>
    {args.children(ctrl)}
  </svg>
};

export default {controller, view}
