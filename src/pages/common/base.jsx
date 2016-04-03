import React from 'react';
import {Link} from 'react-router'

class Base extends React.Component {
  render() {
    return (
      <div>
        <div className="ui fixed blue inverted menu">
          <div className="ui container">
            <Link className="header item" to="/">E-Grid</Link>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default Base
