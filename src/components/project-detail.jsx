import React from 'react'

class ProjectDetail extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default ProjectDetail
