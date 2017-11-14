import React from 'react'
import Base from './base'

class Page extends React.Component {
  render () {
    return <Base>
      <div className='ui container' style={{
        backgroundColor: '#fff',
        padding: '50px 10px 10px',
        marginBottom: '40px',
        boxShadow: '0 0 20px',
        minHeight: 'calc(100vh - 40px)'}}
      >
        {this.props.children}
      </div>
    </Base>
  }
}

export default Page
