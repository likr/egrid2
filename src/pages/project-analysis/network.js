import m from 'mithril'
import {calcLayout} from '../../intents/layout-worker'
import LayoutWorker from '../../models/layout-worker'
import vertex from '../views/vertex'
import edge from '../views/edge'

const controller = ({invalidate}) => {
  const ctrl = {
    vertices: [],
    edges: [],
  };

  const subscription = LayoutWorker.subscribe((e) => {
    m.startComputation();
    Object.assign(ctrl, e.data);
    invalidate();
    m.endComputation();
  });

  ctrl.onunload = () => {
    subscription.dispose();
  };

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
  const {vertices, edges} = ctrl;
  return <g>
    <g>{edges.map(edge)}</g>
    <g>{vertices.map(vertex)}</g>
  </g>
};

export default {controller, view}
