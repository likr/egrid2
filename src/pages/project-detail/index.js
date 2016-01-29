import m from 'mithril'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import {getProject} from '../../intents/project'
import {addParticipant, listParticipants} from '../../intents/participant'
import ConfirmModal from '../common/confirm-modal'
import Page from '../common/page'
import ParticipantCard from './participant-card'
import ParticipantModal from './participant-modal'

const handleClickAddParticipant = (ctrl) => {
  ctrl.participantModal.show({
    title: 'Create Participant',
    data: {
      name: '',
      note: '',
    },
    onapprove: (data) => {
      addParticipant(Object.assign(data, {
        projectId: ctrl.project.id,
      }));
    },
  });
};

const controller = () => {
  const ctrl = {
    project: null,
    participants: [],
    confirmModal: null,
    participantModal: null,
  };

  const projectSubscription = Projects.subscribe(({data}) => {
    m.startComputation();
    ctrl.project = data;
    m.endComputation();
  });

  const participantSubscription = Participants.subscribe((participants) => {
    m.startComputation();
    ctrl.participants = participants;
    m.endComputation();
  });

  ctrl.onunload = () => {
    projectSubscription.dispose();
    participantSubscription.dispose();
  };

  const projectId = m.route.param('projectId');
  getProject(projectId);
  listParticipants(projectId);

  return ctrl;
};

const view = (ctrl) => {
  if (!ctrl.project) {
    return '';
  }

  return <Page>
    <div style={{'margin-bottom': '20px'}}>
      <h2>{ctrl.project.name}</h2>
    </div>
    <h3 class="ui horizontal divider header">Analysis</h3>
    <div>
      <a
          className="ui button"
          href={`/projects/${m.route.param('projectId')}/analysis`}
          config={m.route}>
        Open
      </a>
    </div>
    <h3 class="ui horizontal divider header">Participants</h3>
    <div>
      <div style={{
        'margin-bottom': '20px',
      }}>
        <button className="ui primary button" onclick={handleClickAddParticipant.bind(null, ctrl)}>
          Add
        </button>
      </div>
      <div className="ui one cards">
        {ctrl.participants.map((participant) => {
          return <ParticipantCard
              participant={participant}
              confirmModal={ctrl.confirmModal}
              participantModal={ctrl.participantModal}/>
        })}
      </div>
    </div>
    <ConfirmModal onregister={(modal) => {
      ctrl.confirmModal = modal;
    }}/>
    <ParticipantModal onregister={(modal) => {
      ctrl.participantModal = modal;
    }}/>
  </Page>
};

export default {controller, view}
