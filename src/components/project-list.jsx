import React from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router';
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardText from 'material-ui/lib/card/card-text'
import CardTitle from 'material-ui/lib/card/card-title'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import {
  addProject,
  deleteProject
} from '../actions/project-actions'

const formatDate = (date) => {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

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
        <h3>Your Projects</h3>
        <div style={{marginBottom: '16px'}}>
          <RaisedButton onClick={::this.handleOpenDialog} label="New" primary={true}/>
        </div>
        <div className="row">
          {this.alignedProjects(projects)}
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

  alignedProjects(projects) {
    const result = [];
    projects.forEach((project, i) => {
      result.push((
        <div
          key={project.id}
          className="col-xs-12 col-sm-6 col-md-4">
          <Card
            style={{
              marginBottom: '20px'
            }}>
            <CardTitle
              title={project.name}
              subtitle={`Updated: ${formatDate(project.updated)}`}
            />
            <CardText>{project.note}</CardText>
            <CardActions>
              <FlatButton onClick={this.handleNavigateToDetail.bind(this, project.id)} label="Open"/>
              <FlatButton onClick={this.handleClickDeleteButton.bind(this, project.id)} label="Delete"/>
            </CardActions>
          </Card>
        </div>
      ));
      if (i % 3 === 2) {
        result.push(<div key={`clearfix-md-${i}`} className="clearfix visible-md-block visible-lg-block"/>);
      }
      if (i % 2 === 1) {
        result.push(<div key={`clearfix-sm-${i}`} className="clearfix visible-sm-block"/>);
      }
    });
    return result;
  }
}

export default ProjectList
