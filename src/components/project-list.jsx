import React from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router';
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardText from 'material-ui/lib/card/card-text'
import CardTitle from 'material-ui/lib/card/card-title'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'
import {
  addProject,
  deleteProject,
  updateProject
} from '../actions/project-actions'
import formatDate from '../utils/format-date'
import ConfirmDialog from './confirm-dialog'
import ProjectDialog from './project-dialog'

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
          <RaisedButton onClick={::this.newProject} label="New" primary={true}/>
        </div>
        <div className="row">
          {this.alignedProjects(projects)}
        </div>
        <ConfirmDialog
          ref="deleteConfirmDialog"
          title="Delete project"/>
        <ProjectDialog
          ref="newProjectDialog"
          title="New Project"
          onSubmit={({name, note}) => {
            this.props.dispatch(addProject({name, note}));
          }}/>
      </div>
    );
  }

  newProject() {
    this.refs.newProjectDialog.show();
  }

  deleteProject(id) {
    this.refs.deleteConfirmDialog.show().
      then(() => {
        this.props.dispatch(deleteProject(id));
      }, () => {
      });
  }

  editProject(id) {
    this.refs[`editProjectDialog${id}`].show();
  }

  navigateToDetail(projectId) {
    const path = `/projects/${projectId}/participants`;
    this.props.dispatch(pushState(null, path));
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
              marginBottom: '16px'
            }}>
            <CardTitle
              title={project.name}
              subtitle={`Updated: ${formatDate(project.updated)}`}
            />
            <CardText>{project.note}</CardText>
            <CardActions>
              <FlatButton onClick={this.navigateToDetail.bind(this, project.id)} label="Open"/>
              <FlatButton onClick={this.deleteProject.bind(this, project.id)} label="Delete"/>
              <FlatButton onClick={this.editProject.bind(this, project.id)} label="Edit"/>
            </CardActions>
          </Card>
          <ProjectDialog
            ref={`editProjectDialog${project.id}`}
            title="Edit Project"
            projectId={project.id}
            name={project.name}
            note={project.note}
            onSubmit={({name, note}) => {
              this.props.dispatch(updateProject(project.id, {name, note}));
            }}/>
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
