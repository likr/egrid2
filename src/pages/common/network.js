import m from 'mithril'
import LayoutWorker from '../../models/layout-worker'

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

const view = (ctrl, {children}) => {
  return <g>
    {children(ctrl)}
  </g>
};

export default {controller, view}
