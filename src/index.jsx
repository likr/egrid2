/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk'
import {ReduxRouter, routerStateReducer, reduxReactRouter} from 'redux-router';
import {Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import createHistory from 'history/lib/createBrowserHistory';

import App from './components/app'
import Top from './components/top'
import ProjectList from './components/project-list'
import projectReducer from './reducers/project-reducer'


const reducer = combineReducers({
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
            </Route>
          </ReduxRouter>
        </Provider>
      </div>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('content'));
