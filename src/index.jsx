/* global document */

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
import Top from './components/top'
import ProjectList from './components/project-list'
import ProjectDetail from './components/project-detail'
import ParticipantList from './components/participant-list'

import participantReducer from './reducers/participant-reducer'
import projectReducer from './reducers/project-reducer'

injectTapEventPlugin();


const reducer = combineReducers({
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
              <Route path="projects" component={ProjectList}>
              </Route>
              <Route path="projects/:projectId" component={ProjectDetail}>
                <Route path="participants" component={ParticipantList}/>
              </Route>
            </Route>
          </ReduxRouter>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('content'));
