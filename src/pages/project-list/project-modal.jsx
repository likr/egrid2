/* global $ */
import React from 'react'

class ProjectModal extends React.Component {
  componentDidMount() {
    $(this.refs.modal).modal({
      onApprove: () => {
        this.props.onApprove({
          name: this.refs.name.value,
          note: this.refs.note.value,
        });
      },
    });
  }

  render() {
    const {title} = this.props;
    return (
      <div ref="modal" className="ui modal">
        <div className="header">{title}</div>
        <div className="content">
          <form className="ui form">
            <div className="field">
              <label>Name</label>
              <input ref="name" placeholder="Project Name"/>
            </div>
            <div className="field">
              <label>Note</label>
              <textarea ref="note"/>
            </div>
          </form>
        </div>
        <div className="actions">
          <button className="ui cancel button">Cancel</button>
          <button className="ui primary approve button">Create</button>
        </div>
      </div>
    );
  }

  show(name='', note='') {
    this.refs.name.value = name;
    this.refs.note.value = note;
    $(this.refs.modal).modal('show');
  }
}

export default ProjectModal
