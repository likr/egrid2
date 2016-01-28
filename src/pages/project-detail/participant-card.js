import m from 'mithril'
import {removeParticipant, updateParticipant} from '../../intents/participant'
import popup from '../utils/config-popup'
import formatDate from '../utils/format-date'

const view = (ctrl, {participant, confirmModal, participantModal}) => {
  return <div key={participant.id} className="ui card">
    <div className="content">
      <div className="header">{participant.name}</div>
      <div className="meta">Created at: {formatDate(participant.created)}</div>
      <div className="meta">Updated at: {formatDate(participant.updated)}</div>
      <div className="description">{participant.note}</div>
    </div>
    <div className="extra content">
      <a
          className="ui secondary button"
          href={`/projects/${participant.projectId}/participants/${participant.id}`}
          config={m.route}>
        Interview
      </a>
      <button className="ui icon button" data-content="Edit" config={popup} onclick={() => {
        participantModal.show({
          title: 'Update Participant',
          data: {
            name: participant.name,
            note: participant.note,
          },
          onapprove: (data) => {
            updateParticipant(Object.assign(participant, data));
          },
          ondeny: () => {
          },
        });
      }}>
        <i className="icon edit"/>
      </button>
      <button className="ui icon button" data-content="Remove" config={popup} onclick={() => {
        confirmModal.show({
          title: 'Remove Participant ?',
          text: 'Remove Participant ?',
          onapprove: () => {
            removeParticipant(participant.id);
          },
          ondeny: () => {
          },
        });
      }}>
        <i className="icon remove"/>
      </button>
      <button className="ui icon button" data-content="Copy" config={popup}>
        <i className="icon copy"/>
      </button>
    </div>
  </div>
};

export default {view}
