/* global $ */
import React from 'react'

class FileSelectModal extends React.Component {
  componentDidMount () {
    $(this.refs.modal).modal({
      onApprove: () => {
        this.props.onApprove(this.refs.file.files[0])
      },
    })
  }

  render () {
    const {title} = this.props
    return (
    <div ref="modal" className="ui modal">
      <div className="header">
        {title}
      </div>
      <div className="content">
        <div className="ui form">
          <div className="field">
            <label>
              File
            </label>
            <input ref="file" type="file" />
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="ui cancel button">
          Cancel
        </div>
        <div className="ui primary approve button">
          OK
        </div>
      </div>
    </div>
    )
  }

  show () {
    $(this.refs.modal).modal('show')
  }
}

export default FileSelectModal
