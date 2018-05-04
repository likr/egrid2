import React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {PROJECT_GET} from '../../constants'
import Projects from '../../models/project'
import {getProject, updateProject} from '../../intents/project'
import {createQuestionnaire} from '../../utils/create-questionnaire'
import {online} from '../../utils/online'
import Page from '../common/page'
import QuestionnaireModal from './questionnaire-modal'

class ProjectQuestionnaire extends React.Component {
  static get propTypes () {
    return {
      history: PropTypes.object.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      project: null,
      words: []
    }
  }

  componentDidMount () {
    const {projectId} = this.props.match.params

    this.projectSubscription = Projects.subscribe(({type, data}) => {
      switch (type) {
        case PROJECT_GET:
          const project = data
          const graph = JSON.parse(project.graph)
          const counts = new Map(graph.vertices.map(({d}) => [d.text, d.participants.length]))
          const words = (graph.groups || []).map((group) => {
            let sum = 0
            for (const item of group.items) {
              sum += counts.get(item) || 0
            }
            return {
              key: group.id,
              text: group.name,
              count: sum
            }
          })
          words.sort((w1, w2) => w2.count - w1.count)
          this.setState({project, words})
          break
      }
    })
    getProject(projectId)
  }

  componentWillUnmount () {
    this.projectSubscription.unsubscribe()
  }

  render () {
    const {projectId} = this.props.match.params
    const {project, words, loading} = this.state
    const questionnaires = (project && project.questionnaires) || []
    return <Page>
      <div style={{marginBottom: '20px'}}>
        <div className='ui breadcrumb'>
          <Link className='section' to='/projects'> My Projects
          </Link>
          <i className='right angle icon divider' />
          <Link className='section' to={`/projects/${projectId}`}>
            {project && project.name}
          </Link>
          <i className='right angle icon divider' />
          <div className='active section'>
            Questionnaire
          </div>
        </div>
      </div>
      <div>
        <div className='ui grid'>
          <div className='row'>
            <div className='column'>
              <button
                className={`ui primary button ${loading ? 'loading' : ''} ${online() ? '' : 'disabled'}`}
                onClick={this.handleClickNewButton.bind(this)}>
                New
              </button>
            </div>
          </div>
          <div className='row'>
            <div className='column'>
              <table className='ui celled table'>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Links</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    questionnaires.map((questionnaire, i) => {
                      return <tr key={i}>
                        <td>{questionnaire.title}</td>
                        <td>
                          <a className='ui mini button' target='_blank' href={questionnaire.formUrl}>Show Form</a>
                          <a className='ui mini button' target='_blank' href={questionnaire.formEditUrl}>Edit Form</a>
                          <a className='ui mini button' target='_blank' href={questionnaire.sheetUrl}>Show Result</a>
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <QuestionnaireModal
        ref='modal'
        title='Create Questionnaire'
        items={words}
        onApprove={this.handleApproveModal.bind(this)} />
    </Page>
  }

  handleClickNewButton () {
    if (online()) {
      this.refs.modal.show()
    }
  }

  handleApproveModal (result) {
    const {project} = this.state
    const {title, description, items} = result
    this.setState({
      loading: true
    })
    createQuestionnaire(title, description, items)
      .then((result) => {
        result.created = new Date()
        if (!project.questionnaires) {
          project.questionnaires = []
        }
        project.questionnaires.push(result)
        updateProject(project)
        this.setState({
          loading: false,
          project
        })
      }, (e) => {
        this.setState({
          loading: false
        })
      })
  }
}

export default withRouter(ProjectQuestionnaire)
