import React from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router';
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardTitle from 'material-ui/lib/card/card-title'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import FontIcon from 'material-ui/lib/font-icon'
import TextField from 'material-ui/lib/text-field'
import {
  addProject,
  deleteProject
} from '../actions/project-actions'

@connect((state) => ({
  projects: state.projects
}))
class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: ''
    };
  }

  render() {
    const projects = Object.keys(this.props.projects).
      map((id) => this.props.projects[id]);
    projects.sort((p1, p2) => p2.updated - p1.updated);
    return (
      <div>
        <div>
          <FloatingActionButton
              onClick={::this.handleOpenDialog}>
              <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
        </div>
        <div>
          {projects.map((project) => (
            <Card key={project.id}>
              <CardTitle title={project.name}/>
              <CardActions>
                <FlatButton onClick={this.handleNavigateToDetail.bind(this, project.id)} label="Open"/>
                <FlatButton onClick={this.handleClickDeleteButton.bind(this, project.id)} label="Delete"/>
              </CardActions>
            </Card>
          ))}
        </div>
        <Dialog
            title="Create Project"
            ref="dialog"
            onShow={::this.handleShowDialog}
            actions={[
              {
                text: 'Cancel'
              },
              {
                text: 'Submit',
                onTouchTap: ::this.handleSubmit
              }
            ]}>
          <form onSubmit={::this.handleSubmit}>
            <TextField
              ref="name"
              fullWidth={true}
              floatingLabelText="Project Name"/>
            <TextField
              ref="note"
              fullWidth={true}
              floatingLabelText="Note"
              multiLine={true}
              rows={3}/>
          </form>
        </Dialog>
      </div>
    );
  }

  handleOpenDialog() {
    this.refs.dialog.show();
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    const name = this.refs.name.getValue();
    const note = this.refs.note.getValue();
    if (name) {
      this.props.dispatch(addProject({name, note}));
    }
    this.refs.dialog.dismiss();
  }

  handleClickDeleteButton(id) {
    this.props.dispatch(deleteProject(id));
  }

  handleNavigateToDetail(projectId) {
    const path = `/projects/${projectId}/participants`;
    this.props.dispatch(pushState(null, path));
  }

  handleShowDialog() {
    this.refs.name.focus();
  }
}

export default ProjectList
