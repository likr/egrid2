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

const view = (ctrl, {participants}) => {
  return <div className="ui card" style={{position: 'absolute', top: '120px', left: '20px', width: '428px'}}>
    <div className="content">
      <div className="header">Participants</div>
    </div>
    <div className="content">
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
};

export default {view}
