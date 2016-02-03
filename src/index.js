/* global document */
import m from 'mithril'
import Top from './pages/top/index'
import ProjectList from './pages/project-list/index'
import ProjectDetail from './pages/project-detail/index'
import ProjectAnalysis from './pages/project-analysis/index'
import ProjectWords from './pages/project-words/index'
import ParticipantInterview from './pages/participant-interview/index'

m.route.mode = 'hash';

m.route(document.getElementById('content'), '/', {
  '/': Top,
  '/projects': ProjectList,
  '/projects/:projectId': ProjectDetail,
  '/projects/:projectId/analysis': ProjectAnalysis,
  '/projects/:projectId/words': ProjectWords,
  '/projects/:projectId/participants/:participantId': ParticipantInterview,
});
