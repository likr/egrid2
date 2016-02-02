import m from 'mithril'
import {PROJECT_GET} from '../../constants'
import Projects from '../../models/project'
import Participants from '../../models/participant'
import {getProject} from '../../intents/project'
import {addParticipant, listParticipants} from '../../intents/participant'
import ConfirmModal from '../common/confirm-modal'
import FileSelectModal from '../common/file-select-modal'
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
    fileSelectModal: null,
    participantModal: null,
  };

  const projectSubscription = Projects.subscribe(({type, data}) => {
    if (type === PROJECT_GET) {
      m.startComputation();
      ctrl.project = data;
      m.endComputation();
    }
  });

  const participantSubscription = Participants.subscribe(({data}) => {
    m.startComputation();
    ctrl.participants = data;
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
      <div className="ui breadcrumb">
        <a className="section" href="/projects" config={m.route}>My Projects</a>
        <i className="right angle icon divider"/>
        <div className="active section">{ctrl.project.name}</div>
      </div>
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
              project={ctrl.project}
              participant={participant}
              confirmModal={ctrl.confirmModal}
              fileSelectModal={ctrl.fileSelectModal}
              participantModal={ctrl.participantModal}/>
        })}
      </div>
    </div>
    <ConfirmModal onregister={(modal) => {
      ctrl.confirmModal = modal;
    }}/>
    <FileSelectModal onregister={(modal) => {
      ctrl.fileSelectModal = modal;
    }}/>
    <ParticipantModal onregister={(modal) => {
      ctrl.participantModal = modal;
    }}/>
  </Page>
};

export default {controller, view}
