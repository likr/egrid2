/* global document */

import 'web-animations-js'
import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk'
import {ReduxRouter, routerStateReducer, reduxReactRouter} from 'redux-router';
import {Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import createHistory from 'history/lib/createBrowserHistory';
import injectTapEventPlugin from "react-tap-event-plugin"

import App from './components/app'
import ParticipantInterview from './components/participant-interview'
import ParticipantList from './components/participant-list'
import ProjectDetail from './components/project-detail'
import ProjectList from './components/project-list'
import Top from './components/top'

import graphReducer from './reducers/graph-reducer'
import participantReducer from './reducers/participant-reducer'
import projectReducer from './reducers/project-reducer'

injectTapEventPlugin();


const reducer = combineReducers({
  graph: graphReducer,
  participants: participantReducer,
  projects: projectReducer,
  router: routerStateReducer
});

const store = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    createHistory
  })
)(createStore)(reducer);

class Root extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ReduxRouter>
            <Route path="/" component={App}>
              <IndexRoute component={Top}/>
              <Route path="projects" component={ProjectList}/>
              <Route path="projects/:projectId" component={ProjectDetail}>
                <Route path="participants" component={ParticipantList}/>
                <Route path="participants/:participantId/interview" component={ParticipantInterview}/>
              </Route>
            </Route>
          </ReduxRouter>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('content'));
