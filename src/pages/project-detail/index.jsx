import React from 'react'
import {Link} from 'react-router'
import {PROJECT_GET} from '../../constants'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import {getProject} from '../../intents/project'
import {addParticipant, listParticipants} from '../../intents/participant'
import Page from '../common/page'
import ParticipantCard from './participant-card'
import ParticipantModal from './participant-modal'

class ProjectDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      project: null,
      participants: [],
    };
  }

  componentDidMount() {
    this.projectSubscription = Projects.subscribe(({type, data}) => {
      if (type === PROJECT_GET) {
        this.setState({
          project: data,
        });
      }
    });

    this.participantSubscription = Participants.subscribe(({data}) => {
      this.setState({
        participants: data,
      });
    });

    const projectId = this.props.params.projectId;
    getProject(projectId);
    listParticipants(projectId);
  }

  componentWillUnmount() {
    this.projectSubscription.dispose();
    this.participantSubscription.dispose();
  }

  render() {
    const {project, participants} = this.state;
    const projectId = this.props.params.projectId;
    if (project === null) {
      return <Page>loading</Page>;
    }
    return (
      <Page>
        <div style={{marginBottom: '20px'}}>
          <div className="ui breadcrumb">
            <Link className="section" to="/projects">My Projects</Link>
            <i className="right angle icon divider"/>
            <div className="active section">{project.name}</div>
          </div>
        </div>
        <h3 className="ui horizontal divider header">Analysis</h3>
        <div>
          <Link className="ui button" to={`/projects/${projectId}/analysis`}>Open</Link>
          <Link className="ui button" to={`/projects/${projectId}/words`}>Words</Link>
        </div>
        <h3 className="ui horizontal divider header">Participants</h3>
        <div>
          <div style={{marginBottom: '20px'}}>
            <button className="ui primary button" onClick={this.handleClickAddButton.bind(this)}>
              Add
            </button>
          </div>
          <div className="ui one cards">
            {participants.map((participant) => {
              return <ParticipantCard key={participant.id} project={project} participant={participant}/>
            })}
          </div>
        </div>
        <ParticipantModal
            ref="participantModal"
            title="Create Participant"
            onApprove={this.handleApproveParticipantModal.bind(this)}/>
      </Page>
    );
  }

  handleClickAddButton() {
    this.refs.participantModal.show();
  }

  handleApproveParticipantModal(data) {
    addParticipant(Object.assign(data, {
      projectId: this.props.params.projectId,
    }));
  }
}

export default ProjectDetail
