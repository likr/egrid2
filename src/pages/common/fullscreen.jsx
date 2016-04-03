import React from 'react'
import Base from './base'

class Fullscreen extends React.Component {
  render() {
    const {children} = this.props;
    return (
      <Base>
        <div style={{overflow: 'hidden'}}>
          {children}
        </div>
      </Base>
    );
  }
}

export default Fullscreen
