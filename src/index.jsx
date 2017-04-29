import 'babel-polyfill'
import './service-worker-registration'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import Top from './pages/top/index'
import About from './pages/about/index'
import ProjectAnalysis from './pages/project-analysis/index'
import ProjectDetail from './pages/project-detail/index'
import ProjectList from './pages/project-list/index'
import ProjectWords from './pages/project-words/index'
import ParticipantInterview from './pages/participant-interview/index'

render((
  <Router history={browserHistory}>
    <Route path='/' component={Top} />
    <Route path='/about' component={About} />
    <Route path='/projects' component={ProjectList} />
    <Route path='/projects/:projectId' component={ProjectDetail} />
    <Route path='/projects/:projectId/analysis' component={ProjectAnalysis} />
    <Route path='/projects/:projectId/words' component={ProjectWords} />
    <Route path='/projects/:projectId/participants/:participantId' component={ParticipantInterview} />
  </Router>
  ), document.getElementById('content'))
