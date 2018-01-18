import React from 'react'
import {Prompt, withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {PROJECT_GET, PROJECT_UPDATE} from '../../constants'
import Projects from '../../models/project'
import {getProject, updateProject} from '../../intents/project'
import Page from '../common/page'
import Word from './word'
import Group from './group'

const restoreGroups = (vertices) => {
  const groupsMap = new Map()
  for (const v of vertices.filter(({d}) => d.parent != null)) {
    if (!groupsMap.has(v.d.parent)) {
      groupsMap.set(v.d.parent, {
        color: '#ffffff',
        id: v.d.parent,
        items: [],
        name: ''
      })
    }
    groupsMap.get(v.d.parent).items.push(v.u)
  }
  const groups = []
  const numGroups = Math.max(...groupsMap.keys()) + 1
  for (let i = 0; i < numGroups; ++i) {
    if (groupsMap.has(i)) {
      groups.push(groupsMap.get(i))
    } else {
      groups.push({
        color: '#ffffff',
        id: i,
        items: [],
        name: ''
      })
    }
  }
  return groups
}

class ProjectWords extends React.Component {
  static get propTypes () {
    return {
      history: PropTypes.object.isRequired
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      saved: true,
      project: null,
      words: {},
      groups: [],
      searchLeft: '',
      searchRight: ''
    }
  }

  componentDidMount () {
    const {projectId} = this.props.match.params

    this.projectSubscription = Projects.subscribe(({type, data}) => {
      switch (type) {
        case PROJECT_GET:
          const project = data
          const graph = JSON.parse(project.graph)
          const words = {}
          for (const vertex of graph.vertices) {
            words[vertex.u] = vertex
          }
          if (!graph.groups && graph.vertices.some(({d}) => d.parent != null)) {
            console.info('restoring groups') // Migration for group deletion bug
            graph.groups = restoreGroups(graph.vertices)
          }
          const groups = graph.groups || []
          for (const group of groups) {
            group.items = group.items.filter((u) => words[u])
          }
          this.setState({project, words, groups})
          break
        case PROJECT_UPDATE:
          this.setState({
            saved: true
          })
          this.props.history.push(`/projects/${projectId}`)
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
    const {project, searchLeft, searchRight} = this.state
    const words = Object.values(this.state.words).filter(({d}) => {
      return d.parent === undefined && d.text.indexOf(searchLeft) >= 0
    })
    const groups = this.state.groups.filter((group) => {
      if (group.name.indexOf(searchRight) >= 0) {
        return true
      }
      return group.items.some((u) => this.state.words[u].d.text.indexOf(searchRight) >= 0)
    })
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
            Words
          </div>
        </div>
      </div>
      <div>
        <div className='ui grid'>
          <div className='row'>
            <div className='column'>
              <button className='ui primary button' onClick={this.handleClickSaveButton.bind(this)}>
                Save
              </button>
            </div>
          </div>
          <div className='two column row'>
            <div className='column'>
              <div className='ui vertical segment'>
                <div className='ui form'>
                  <div className='field'>
                    <div className='ui fluid left icon right action input'>
                      <input placeholder='Search...' value={searchLeft} onInput={this.handleInputSearchLeft.bind(this)} />
                      <i className='icon search' />
                      <button className='ui icon button' onClick={this.handleClickClearSearchLeftButton.bind(this)}>
                        <i className='icon remove' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className='ui vertical segment'
                onDrop={this.handleDropToList.bind(this)}
                onDragOver={this.handleDragOver.bind(this)}
                style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'scroll'}}>
                {words.map(({u, d}) => <Word key={u} u={u} d={d} />)}
              </div>
            </div>
            <div className='ui vertical divider'>
              <i className='icon arrow right' />
            </div>
            <div className='column'>
              <div className='ui vertical segment'>
                <div className='ui form'>
                  <div className='field'>
                    <div className='ui fluid left icon right action input'>
                      <input placeholder='Search...' value={searchRight} onInput={this.handleInputSearchRight.bind(this)} />
                      <i className='icon search' />
                      <button className='ui icon button' onClick={this.handleClickClearSearchRightButton.bind(this)}>
                        <i className='icon remove' />
                      </button>
                    </div>
                  </div>
                  <div className='field'>
                    <button className='ui button' onClick={this.handleClickAddGroupButton.bind(this)}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className='ui vertical segment' style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'scroll'}}>
                <div className='ui one cards'>
                  {groups.map((group) => {
                    return <Group
                      key={group.id}
                      group={group}
                      words={group.items.map((u) => this.state.words[u])}
                      handleDropToGroup={this.handleDropToGroup.bind(this, group)}
                      handleDragOver={this.handleDragOver.bind(this)} />
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Prompt message='保存せずに終了しますか？' when={!this.state.saved} />
    </Page>
  }

  handleDragOver (event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  handleDropToList (event) {
    const {words, groups} = this.state
    const u = event.dataTransfer.getData('text')
    const data = words[u]
    if (data.d.parent !== undefined) {
      const group = groups[data.d.parent]
      group.items.splice(group.items.indexOf(u), 1)
      delete data.d.parent
    }
    this.setState({
      words,
      groups,
      saved: false
    })
  }

  handleDropToGroup (group, event) {
    event.preventDefault()
    const {words, groups} = this.state
    const u = event.dataTransfer.getData('text')
    const data = words[u]
    if (data.d.parent !== undefined) {
      const oldGroup = groups[data.d.parent]
      oldGroup.items.splice(oldGroup.items.indexOf(u), 1)
    }
    group.items.push(u)
    data.d.parent = group.id
    this.setState({
      saved: false
    })
  }

  handleClickAddGroupButton () {
    const {groups} = this.state
    groups.push({
      id: Math.max(0, ...groups.map(({id}) => id + 1)),
      name: '',
      color: '#ffffff',
      items: []
    })
    this.setState({
      saved: false,
      groups
    })
  }

  handleInputSearchLeft (event) {
    this.setState({
      searchLeft: event.target.value
    })
  }

  handleInputSearchRight (event) {
    this.setState({
      searchRight: event.target.value
    })
  }

  handleClickClearSearchLeftButton () {
    this.setState({
      searchLeft: ''
    })
  }

  handleClickClearSearchRightButton () {
    this.setState({
      searchRight: ''
    })
  }

  handleClickSaveButton () {
    const {project, words, groups} = this.state
    const graph = Object.assign(JSON.parse(project.graph), {
      vertices: Object.values(words),
      groups: groups
    })
    project.graph = JSON.stringify(graph)
    updateProject(project)
  }
}

export default withRouter(ProjectWords)
