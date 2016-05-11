/* global $ */
import React from 'react'
import { updateParticipants } from '../../intents/analysis'

class CheckBox extends React.Component {
  componentDidMount () {
    const {participant} = this.props
    $(this.refs.checkbox).checkbox({
      onChecked: () => {
        updateParticipants({[participant.id]: true})
      },
      onUnchecked: () => {
        updateParticipants({[participant.id]: false})
      },
    })
  }

  render () {
    const {participant, checked} = this.props
    return (
    <div ref="checkbox" className="ui checkbox">
      <input type="checkbox" checked={checked} onChange={() => {}}/>
      <label>
        {participant.name}
      </label>
    </div>
    )
  }
}

export default CheckBox
