/* global $ */
import React from 'react'

class QuestionnaireModal extends React.Component {
  componentDidMount () {
    $(this.refs.modal).modal({
      onApprove: () => {
        const {items} = this.props
        const result = []
        for (const item of items) {
          if (this.refs[item.key].checked) {
            result.push(item.text)
          }
        }
        this.props.onApprove({
          title: this.refs.title.value,
          description: this.refs.description.value,
          items: result
        })
      }
    })
  }

  render () {
    const {title, items} = this.props
    return <div ref='modal' className='ui modal'>
      <div className='header'>
        {title}
      </div>
      <div className='content'>
        <div className='ui form'>
          <div className='field'>
            <label>Title</label>
            <input ref='title' placeholder='Questionnaire Title' />
          </div>
          <div className='field'>
            <label>Description</label>
            <input ref='description' placeholder='Questionnaire Description' />
          </div>
          <div className='grouped fields'>
            {
              items.map((item) => {
                return <div key={item.key} className='field'>
                  <div className='ui checkbox'>
                    <input ref={item.key} type='checkbox' />
                    <label>{item.text} ({item.count})</label>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
      <div className='actions'>
        <button className='ui cancel button'>
          Cancel
        </button>
        <button ref='approveButton' className='ui primary approve button'>
          Create
        </button>
      </div>
    </div>
  }

  show (name = '', note = '') {
    $(this.refs.modal).modal('show')
    $('.ui.checkbox').checkbox()
  }

  handleSubmit (event) {
    event.preventDefault()
    this.refs.approveButton.click()
  }
}

export default QuestionnaireModal
