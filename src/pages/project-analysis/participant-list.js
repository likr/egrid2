/* global $ */

import m from 'mithril'

const checkbox = (element) => {
  $(element).checkbox();
};

const view = (ctrl, {participants}) => {
  return <div className="ui card" style={{position: 'absolute', top: '60px', left: '20px', width: '428px'}}>
    <div className="content">
      <div className="header">Participants</div>
    </div>
    <div className="content">
      <div className="ui form">
        {participants.map(({participant}) => {
          return <div className="field">
            <div className="ui checkbox" config={checkbox}>
              <input checked="checked" type="checkbox"/>
              <label>{participant.name}</label>
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
};

export default {view}
