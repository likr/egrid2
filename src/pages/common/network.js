import m from 'mithril'
import LayoutWorker from '../../models/layout-worker'

const controller = ({invalidate, center}) => {
  const ctrl = {
    vertices: [],
    edges: [],
  };

  let first = true;

  const layoutSubscription = LayoutWorker.subscribe(({data}) => {
    const {vertices, edges} = data;
    m.startComputation();
    ctrl.vertices = vertices;
    ctrl.edges = edges;
    invalidate();
    if (first) {
      center(data.width, data.height);
      first = false;
    }
    m.endComputation();
  });

  ctrl.onunload = () => {
    layoutSubscription.dispose();
  };

  return ctrl;
};

const view = (ctrl, {children}) => {
  return <g>
    {children(ctrl)}
  </g>
};

export default {controller, view}
