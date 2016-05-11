/* global $ */
import React from 'react'

class TextInputModal extends React.Component {
  componentDidMount () {
    $(this.refs.modal).modal({
      onApprove: () => {
        this.props.onApprove(this.refs.text.value, this.context)
      },
    })
    $(this.refs.form).on('submit', () => {
      this.refs.approveButton.click()
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
        <form ref="form" className="ui form">
          <div className="field">
            <label>
              評価項目の入力
            </label>
            <input ref="text" />
          </div>
        </form>
      </div>
      <div className="actions">
        <button className="ui cancel button">
          Cancel
        </button>
        <button ref="approveButton" className="ui primary approve button">
          OK
        </button>
      </div>
    </div>
    )
  }

  show (text = '' , context = {}) {
    this.refs.text.value = text
    this.context = context
    $(this.refs.modal).modal('show')
  }
}

export default TextInputModal
