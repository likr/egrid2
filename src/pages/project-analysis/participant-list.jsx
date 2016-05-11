import React from 'react'
import CheckBox from './checkbox'

class ParticipantList extends React.Component {
  render () {
    const {participants} = this.props
    return (
    <div>
      <h4 className="ui header">Participants</h4>
      <div className="ui form">
        {participants.map(({participant, checked}) => {
           return <div key={participant.id} className="field">
                    <CheckBox participant={participant} checked={checked} />
                  </div>
         })}
      </div>
    </div>
    )
  }
}

export default ParticipantList
