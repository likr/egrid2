import m from 'mithril'
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
