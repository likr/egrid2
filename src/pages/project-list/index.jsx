import React from 'react'
import {
  addProject,
  loadProjects,
  syncProjects
} from '../../intents/project'
import Project from '../../models/project'
import Page from '../common/page'
import ProjectCard from './project-card'
import ProjectModal from './project-modal'

class ProjectList extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
  }

  componentDidMount () {
    this.subscription = Project.subscribe(({data}) => {
      this.setState({
        projects: data
      })
    })
    loadProjects()
  }

  componentWillUnmount () {
    this.subscription.unsubscribe()
  }

  render () {
    return <Page>
      <div style={{marginBottom: '20px'}}>
        <div className='ui breadcrumb'>
          <div className='active section'>
            My Projects
          </div>
        </div>
      </div>
      <div style={{marginBottom: '20px'}}>
        <button className='ui primary button' onClick={this.handleClickAddButton.bind(this)}>
          Add
        </button>
        <button className='ui button' onClick={this.handleClickSyncButton.bind(this)}>
          Sync
        </button>
      </div>
      <div className='ui one cards'>
        {this.state.projects.map((project) => {
          return <ProjectCard key={project.id} project={project} />
        })}
      </div>
      <ProjectModal ref='projectModal' title='Create Project' onApprove={this.handleApproveProjectModal.bind(this)} />
    </Page>
  }

  handleClickAddButton () {
    this.refs.projectModal.show()
  }

  handleClickSyncButton () {
    syncProjects()
  }

  handleApproveProjectModal (data) {
    addProject(data)
  }
}

export default ProjectList
