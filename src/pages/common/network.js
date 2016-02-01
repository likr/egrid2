import m from 'mithril'
import LayoutWorker from '../../models/layout-worker'
import Graph from '../../models/graph'

const controller = ({invalidate, center}) => {
  const ctrl = {
    graph: null,
    vertices: [],
    edges: [],
  };

  const layoutSubscription = LayoutWorker.subscribe(({data}) => {
    const {vertices, edges} = data;
    m.startComputation();
    ctrl.vertices = vertices;
    ctrl.edges = edges;
    if (ctrl.graph) {
      for (const {u, x, y} of vertices) {
        Object.assign(ctrl.graph.vertex(u), {x, y});
      }
      for (const {u, v, points} of edges) {
        Object.assign(ctrl.graph.edge(u, v), {points});
      }
    }
    invalidate();
    center(data.width, data.height);
    m.endComputation();
  });

  const graphSubscription = Graph.subscribe(({graph}) => {
    ctrl.graph = graph;
  });

  ctrl.onunload = () => {
    layoutSubscription.dispose();
    graphSubscription.dispose();
  };

  return ctrl;
};

const view = (ctrl, {children}) => {
  return <g>
    {children(ctrl)}
  </g>
};

export default {controller, view}
