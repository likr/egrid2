import React from 'react'
import {Link} from 'react-router'
import {removeProject, updateProject} from '../../intents/project'
import popup from '../utils/config-popup'
import formatDate from '../utils/format-date'
import ConfirmModal from '../common/confirm-modal'
import ProjectModal from './project-modal'

class ProjectCard extends React.Component {
  render() {
    const {project} = this.props;
    return (
      <div className="card">
        <div className="content">
          <div className="header">{project.name}</div>
          <div className="meta">Created at: {formatDate(project.created)}</div>
          <div className="meta">Updated at: {formatDate(project.updated)}</div>
          <div className="description">{project.note}</div>
        </div>
        <div className="extra content">
          <Link className="ui secondary button" to={`/projects/${project.id}`}>Open</Link>
          <button
              className="ui icon button"
              dataContent="Edit"
              config={popup}
              onClick={this.handleClickEditButton.bind(this)}>
            <i className="icon edit"/>
          </button>
          <button
              className="ui icon button"
              dataContent="Remove"
              config={popup}
              onClick={this.handleClickRemoveButton.bind(this)}>
            <i className="icon remove"/>
          </button>
        </div>
        <ConfirmModal
            ref="confirmModal"
            title="Remove Project ?"
            text="Remove Project ?"
            onApprove={this.handleApproveConfirmModal.bind(this)}/>
        <ProjectModal
            ref="projectModal"
            title='Update Project'
            onApprove={this.handleApproveProjectModal.bind(this)}/>
      </div>
    );
  }

  handleClickEditButton() {
    const {name, note} = this.props.project;
    this.refs.projectModal.show(name, note);
  }

  handleApproveProjectModal(data) {
    updateProject(Object.assign(this.props.project, data));
  }

  handleClickRemoveButton() {
    this.refs.confirmModal.show();
  }

  handleApproveConfirmModal() {
    removeProject(this.props.project.id);
  }
}

export default ProjectCard
