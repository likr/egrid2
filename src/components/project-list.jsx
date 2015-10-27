import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {
  addProject,
  deleteProject,
  loadProjects
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

  componentDidMount() {
    this.props.dispatch(loadProjects());
  }

  render() {
    return (
      <div>
        <div>
          <form onSubmit={::this.handleSubmit}>
            <input type="text" value={this.state.projectName} onChange={::this.handleChangeProjectName}/>
            <button type="submit">Add</button>
          </form>
        </div>
        <div>
          {this.props.projects.map((project) => (
            <div key={project.id}>
              <Link to={`/projects/${project.id}/participants`}>{project.name}</Link>
              <button onClick={this.handleClickDeleteButton.bind(this, project.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  handleChangeProjectName(event) {
    this.setState({
      projectName: event.target.value
    });
  }

  handleSubmit() {
    this.props.dispatch(addProject(this.state.projectName));
  }

  handleClickDeleteButton(id) {
    this.props.dispatch(deleteProject(id));
  }
}

export default ProjectList
