/* global $ */
import React from 'react'

class ConfirmModal extends React.Component {
  componentDidMount() {
    $(this.refs.modal).modal({
      onApprove: this.props.onApprove,
    });
  }

  render() {
    const {title, text} = this.props;
    return (
      <div ref="modal" className="ui modal">
        <div className="header">{title}</div>
        <div className="content">{text}</div>
        <div className="actions">
          <div className="ui cancel button">Cancel</div>
          <div className="ui primary approve button">OK</div>
        </div>
      </div>
    );
  }

  show() {
    $(this.refs.modal).modal('show');
  }
}

export default ConfirmModal
