import React from 'react'
import {connect} from 'react-redux'
import AppBar from 'material-ui/lib/app-bar'
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
    return (
      <div>
        <AppBar
          style={{
            position: 'fixed',
            top: 0
          }}
          title="E-Grid"
          showMenuIconButton={false}
        />
        <div className="container">
          <div style={{marginTop: '80px'}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default App
