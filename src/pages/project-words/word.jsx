import React from 'react'

class Word extends React.Component {
  render () {
    const {u, d} = this.props
    return <div
      className='ui compact message'
      draggable='true'
      onDragStart={this.handleDragStart.bind(this, u)}
      style={{margin: '5px'}}>
      {d.text}
    </div>
  }

  handleDragStart (u, event) {
    event.dataTransfer.setData('text/plain', u)
  }
}

export default Word
