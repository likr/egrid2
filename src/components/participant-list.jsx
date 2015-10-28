import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardTitle from 'material-ui/lib/card/card-title'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'
import {loadProjects} from '../actions/project-actions'
import {addParticipant, deleteParticipant, loadParticipants} from '../actions/participant-actions'

@connect((state) => ({
  participants: state.participants,
  projects: state.projects
}))
class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participantName: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(loadProjects());
    this.props.dispatch(loadParticipants());
  }

  render() {
    const project = this.props.projects[this.props.params.projectId];
    if (!project) {
      return <div/>;
    }

    return (
      <div>
        <h3>{project.name}</h3>
        <div>
          <form onSubmit={::this.handleSubmit}>
            <TextField value={this.state.participantName} onChange={::this.handleChangeParticipantName}/>
            <FlatButton type="submit">Add</FlatButton>
          </form>
        </div>
        <div>
          {Object.keys(this.props.participants).map((id) => {
            const participant = this.props.participants[id];
            return (
              <Card key={participant.id}>
                <CardTitle title={participant.name}/>
                <CardActions>
                  <FlatButton containerElement={<Link to={`/projects/${project.id}/participants/${participant.id}`}/>} linkButton={true} label="Open"/>
                  <FlatButton onClick={this.handleClickDeleteButton.bind(this, participant.id)} label="Delete"/>
                </CardActions>
              </Card>
            )
          })}
        </div>
      </div>
    );
  }

  handleChangeParticipantName(event) {
    this.setState({
      participantName: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.dispatch(addParticipant(this.state.participantName));
  }

  handleClickDeleteButton(id) {
    this.props.dispatch(deleteParticipant(id));
  }
}

export default ParticipantList
