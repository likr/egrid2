import React from 'react'

class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    const project = this.props.project;

    return (
      <div>
        <div>
        </div>
        <div>
          {this.props.participants.map((participant) => (
            <div>
              <Link to={`/projects/${project.id}/participants/${participant.id}`}>{participant.name}</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ParticipantList
