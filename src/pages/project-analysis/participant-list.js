/* global $ */

import m from 'mithril'
import {updateParticipants} from '../../intents/analysis'

const checkbox = (participant) => {
  return (element) => {
    $(element).checkbox({
      onChecked: () => {
        updateParticipants({[participant.id]: true});
      },
      onUnchecked: () => {
        updateParticipants({[participant.id]: false});
      },
    });
  };
};

const view = (ctrl, {show, participants}) => {
  return <div
      className="ui card"
      style={{
        transition: 'opacity .5s ease, visibility .5s ease',
        opacity: show ? 1 : 0,
        visibility: show ? 'visible' : 'hidden',
      }}>
    <div className="content">
      <div className="header">Participants</div>
    </div>
    <div className="content">
      <div style={{'max-height': '300px', 'overflow-y': 'scroll'}}>
        <div className="ui form">
          {participants.map(({participant, checked}) => {
            return <div key={participant.id} className="field">
              <div className="ui checkbox" config={checkbox(participant)}>
                <input checked={checked ? 'checked' : ''} type="checkbox"/>
                <label>{participant.name}</label>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  </div>
};

export default {view}
