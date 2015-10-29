import React from 'react'
import {connect} from 'react-redux'
import {pushState} from 'redux-router';
import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardTitle from 'material-ui/lib/card/card-title'
import FlatButton from 'material-ui/lib/flat-button'
import IconButton from 'material-ui/lib/icon-button'
import TextField from 'material-ui/lib/text-field'
import {addParticipant, deleteParticipant} from '../actions/participant-actions'

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

  render() {
    const {projectId} = this.props.params;
    const project = this.props.projects[projectId];
    if (!project) {
      return <div/>;
    }

    return (
      <div>
        <h3>{project.name}</h3>
        <div>
          <IconButton
              iconClassName="material-icons"
              onClick={::this.handleBack}>
            arrow_back
          </IconButton>
          <IconButton
              iconClassName="material-icons"
              onClick={::this.handleNavigateToAnalysis}>
            open_in_new
          </IconButton>
        </div>
        <div>
          <form onSubmit={::this.handleSubmit}>
            <TextField value={this.state.participantName} onChange={::this.handleChangeParticipantName}/>
            <FlatButton type="submit">Add</FlatButton>
          </form>
        </div>
        <div>
          {
            Object.keys(this.props.participants)
              .map((id) => this.props.participants[id])
              .filter((participant) => participant.projectId === project.id)
              .map((participant) => {
                return (
                  <Card key={participant.id}>
                    <CardTitle title={participant.name}/>
                    <CardActions>
                      <FlatButton onClick={this.handleNavigateToInterview.bind(this, participant.id)} label="Interview"/>
                      <FlatButton onClick={this.handleClickDeleteButton.bind(this, participant.id)} label="Delete"/>
                    </CardActions>
                  </Card>
                )
              })
          }
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
    this.props.dispatch(addParticipant({
      projectId: +this.props.params.projectId,
      name: this.state.participantName
    }));
  }

  handleClickDeleteButton(id) {
    this.props.dispatch(deleteParticipant(id));
  }

  handleBack() {
    this.props.dispatch(pushState(null, `/projects`));
  }

  handleNavigateToAnalysis() {
    const path = `/projects/${this.props.params.projectId}/analysis`;
    this.props.dispatch(pushState(null, path));
  }

  handleNavigateToInterview(participantId) {
    const path = `/projects/${this.props.params.projectId}/participants/${participantId}/interview`;
    this.props.dispatch(pushState(null, path));
  }
}

export default ParticipantList
