import React from 'react'
import { Link } from 'react-router-dom'

class Base extends React.Component {
  render () {
    return <div>
      <div className='ui fixed inverted menu' style={{backgroundColor: '#303a48'}}>
        <div className='ui container'>
          <Link className='header item' to='/'>E-Grid </Link>
          <Link className='item' to='/manual'>Help </Link>
          <Link className='item' to='/about'>About </Link>
        </div>
      </div>
      {this.props.children}
    </div>
  }
}

export default Base
