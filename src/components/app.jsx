import React from 'react'
import {connect} from 'react-redux'
import {loadProjects} from '../actions/project-actions'
import {loadParticipants} from '../actions/participant-actions'

@connect((state) => ({
  participants: state.participants,
  projects: state.projects
}))
class App extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadProjects());
    this.props.dispatch(loadParticipants());
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default App
