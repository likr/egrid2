/* global document */
import m from 'mithril'
import ProjectList from './pages/project-list/index'
import ProjectDetail from './pages/project-detail/index'
import ProjectAnalysis from './pages/project-analysis/index'

m.route.mode = 'hash';

m.route(document.getElementById('content'), '/projects', {
  '/projects': ProjectList,
  '/projects/:projectId': ProjectDetail,
  '/projects/:projectId/analysis': ProjectAnalysis,
});
