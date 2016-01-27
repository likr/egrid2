import m from 'mithril'
import {calcLayout} from '../../intents/layout-worker'
import LayoutWorker from '../../models/layout-worker'
import vertex from './views/vertex'
import edge from './views/edge'

const controller = () => {
  const ctrl = {
    initialized: false,
    vertices: [],
    edges: [],
    onunload: () => {
    },
  };

  LayoutWorker.subscribe((e) => {
    m.startComputation();
    ctrl.initialized = false;
    Object.assign(ctrl, e.data);
    m.endComputation();
  });

  m.request({method: 'GET', url: 'graph.json'})
    .then((data) => {
      for (const {d} of data.vertices) {
        d.width = 100;
        d.height = 20;
      }
      calcLayout(data);
    });

  return ctrl;
};

const view = (ctrl) => {
  if (ctrl.initialized) {
    return {subtree: 'retain'};
  }
  ctrl.initialized = true;

  const {vertices, edges} = ctrl;
  return <g>
    <g>{edges.map(edge)}</g>
    <g>{vertices.map(vertex)}</g>
  </g>
};

export default {controller, view}
