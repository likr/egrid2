import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardTitle from 'material-ui/lib/card/card-title'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'
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
            <TextField value={this.state.projectName} onChange={::this.handleChangeProjectName}/>
            <FlatButton type="submit">Add</FlatButton>
          </form>
        </div>
        <div>
          {Object.keys(this.props.projects).map((id) => {
            const project = this.props.projects[id];
            return (
              <Card key={project.id}>
                <CardTitle title={project.name}/>
                <CardActions>
                  <FlatButton containerElement={<Link to={`/projects/${project.id}/participants`}/>} linkButton={true} label="Open"/>
                  <FlatButton onClick={this.handleClickDeleteButton.bind(this, project.id)} label="Delete"/>
                </CardActions>
              </Card>
            )
          })}
        </div>
      </div>
    );
  }

  handleChangeProjectName(event) {
    this.setState({
      projectName: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.dispatch(addProject(this.state.projectName));
  }

  handleClickDeleteButton(id) {
    this.props.dispatch(deleteProject(id));
  }
}

export default ProjectList
