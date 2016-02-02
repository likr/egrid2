import m from 'mithril'
import LayoutWorker from '../../models/layout-worker'

const controller = ({invalidate, center}) => {
  const ctrl = {
    vertices: [],
    edges: [],
  };

  const layoutSubscription = LayoutWorker.subscribe(({data}) => {
    const {vertices, edges} = data;
    m.startComputation();
    ctrl.vertices = vertices;
    ctrl.edges = edges;
    invalidate();
    center(data.width, data.height);
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
