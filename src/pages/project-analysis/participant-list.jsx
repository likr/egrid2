import React from 'react'
import CheckBox from './checkbox'

class ParticipantList extends React.Component {
  render() {
    const {participants} = this.props;
    return (
      <div className="ui card">
        <div className="content">
          <div className="header">Participants</div>
        </div>
        <div className="content">
          <div style={{maxHeight: '300px', overflowY: 'scroll'}}>
            <div className="ui form">
              {participants.map(({participant, checked}) => {
                return <div key={participant.id} className="field">
                  <CheckBox participant={participant} checked={checked}/>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ParticipantList
