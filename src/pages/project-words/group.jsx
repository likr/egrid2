import React from 'react'
import Word from './word'

class Group extends React.Component {
  render () {
    const {group, words, handleDropToGroup, handleDragOver} = this.props
    return <div className='ui card' onDrop={handleDropToGroup} onDragOver={handleDragOver}>
      <div className='content'>
        <div className='ui form'>
          <div className='two fields'>
            <div className='field'>
              <label>
                Name
              </label>
              <input type='text' value={group.name} onChange={this.handleChangeGroupName.bind(this)} />
            </div>
            <div className='field'>
              <label>
                Color
              </label>
              <input type='color' value={group.color} onChange={this.handleChangeGroupColor.bind(this)} />
            </div>
          </div>
          <div className='field' />
        </div>
      </div>
      <div className='content' style={{minHeight: '100px'}}>
        {words.map(({u, d}) => <Word key={u} u={u} d={d} />)}
      </div>
    </div>
  }

  handleChangeGroupName (event) {
    this.props.group.name = event.target.value
    this.setState({})
  }

  handleChangeGroupColor (event) {
    this.props.group.color = event.target.value
    this.setState({})
  }
}

export default Group
