import m from 'mithril'
import d3 from 'd3'

const controller = () => ({
    x: 0,
    y: 0,
    scale: 1,
  });

const view = (ctrl, {selector, attributes, childComponent, disableDblclick}) => {
  return m(selector, Object.assign({}, attributes, {
    config: (element, isInit) => {
      if (!isInit) {
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
        if (disableDblclick) {
          selection.on('dblclick.zoom', null);
        }
      }
    },
  }), [
    m.component(childComponent, Object.assign({}, ctrl)),
  ]);
};

export default {controller, view}
