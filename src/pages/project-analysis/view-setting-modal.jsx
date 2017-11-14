/* global $ */
import React from 'react'

class ViewSettingModal extends React.Component {
  componentDidMount () {
    $(this.refs.modal).modal({
      onApprove: () => {
        this.props.onApprove({
          textMaxLength: +this.refs.textMaxLength.value
        })
      }
    })
  }

  render () {
    return <div ref='modal' className='ui modal'>
      <div className='header'>
        View Settings
      </div>
      <div className='content'>
        <form className='ui form' onSubmit={this.handleSubmit.bind(this)}>
          <div className='field'>
            <label>
              Max Text Length
            </label>
            <input ref='textMaxLength' type='number' placeholder='20' min='0' />
          </div>
        </form>
      </div>
      <div className='actions'>
        <button className='ui cancel button'>
          Cancel
        </button>
        <button ref='approveButton' className='ui primary approve button'>
          Update
        </button>
      </div>
    </div>
  }

  show (args) {
    const {
      textMaxLength
    } = args
    this.refs.textMaxLength.value = textMaxLength
    $(this.refs.modal).modal('show')
  }

  handleSubmit (event) {
    event.preventDefault()
    this.refs.approveButton.click()
  }
}

export default ViewSettingModal
