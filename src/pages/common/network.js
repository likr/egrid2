import m from 'mithril'
import LayoutWorker from '../../models/layout-worker'

const controller = ({invalidate, center}) => {
  const ctrl = {
    vertices: [],
    edges: [],
  };

  const subscription = LayoutWorker.subscribe(({data}) => {
    m.startComputation();
    Object.assign(ctrl, data);
    invalidate();
    center(data.width, data.height);
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
