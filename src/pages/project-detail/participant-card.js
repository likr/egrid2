/* global FileReader */
import m from 'mithril'
import Graph from 'egraph/lib/graph'
import graphToJson from '../../utils/graph-to-json'
import {removeParticipant, updateParticipant} from '../../intents/participant'
import {updateProject} from '../../intents/project'
import popup from '../utils/config-popup'
import formatDate from '../utils/format-date'

const merge = (graphData, inputData, participantId) => {
  const graph = new Graph();
  for (const {u, d} of graphData.vertices) {
    graph.addVertex(u, d);
  }
  for (const {u, v, d} of graphData.edges) {
    graph.addEdge(u, v, d);
  }
  if (inputData.nodes && inputData.links) {
    const indices = {};
    inputData.nodes.forEach(({text}, i) => {
      indices[i] = text;
      const d = graph.vertex(text);
      if (d === null) {
        graph.addVertex(text, {text, participants: [participantId]});
      } else if (d.participants.indexOf(participantId) < 0) {
        d.participants.push(participantId);
      }
    });
    for (const {source, target} of inputData.links) {
      if (source === target) {
        continue;
      }
      const u = indices[source];
      const v = indices[target];
      const d = graph.edge(u, v);
      if (d === null) {
        graph.addEdge(u, v, {participants: [participantId]});
      } else if (d.participants.indexOf(participantId) < 0) {
        d.participants.push(participantId);
      }
    }
  }
  return graphToJson(graph);
};

const handleClickEdit = ({participant, participantModal}) => {
  return () => {
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
  };
};

const handleClickRemove = ({project, participant, confirmModal}) => {
  return () => {
    confirmModal.show({
      title: 'Remove Participant',
      text: '削除します。',
      onapprove: () => {
        removeParticipant(participant.id);
        const data = JSON.parse(project.graph);
        for (const {d} of data.vertices) {
          const index = d.participants.indexOf(participant.id);
          if (index > -1) {
            d.participants.splice(index, 1);
          }
        }
        for (const {d} of data.edges) {
          const index = d.participants.indexOf(participant.id);
          if (index > -1) {
            d.participants.splice(index, 1);
          }
        }
        project.graph = JSON.stringify(data);
        updateProject(project);
      },
      ondeny: () => {
      },
    });
  };
};

const handleClickImport = ({project, participant, fileSelectModal}) => {
  return () => {
    fileSelectModal.show({
      title: 'Select File',
      onapprove: (file) => {
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            const graph = JSON.parse(project.graph);
            project.graph = JSON.stringify(merge(graph, data, participant.id));
            updateProject(project);
          };
          reader.readAsText(file);
        }
      },
    });
  };
};

const view = (ctrl, {project, participant, confirmModal, participantModal, fileSelectModal}) => {
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
      <button className="ui icon button" data-content="Edit" config={popup} onclick={handleClickEdit({participant, participantModal})}>
        <i className="icon edit"/>
      </button>
      <button className="ui icon button" data-content="Remove" config={popup} onclick={handleClickRemove({project, participant, confirmModal})}>
        <i className="icon remove"/>
      </button>
      <button className="ui icon button" data-content="Import" config={popup} onclick={handleClickImport({project, participant, fileSelectModal})}>
        <i className="icon upload"/>
      </button>
    </div>
  </div>
};

export default {view}
