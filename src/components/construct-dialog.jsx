import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import TextField from 'material-ui/lib/text-field'

class ConstructDialog extends React.Component {
  render() {
    return (
      <Dialog
          title="Input construct"
          ref="dialog"
          onShow={::this.handleShow}
          onDismiss={::this.handleDissmiss}
          actions={[
            {
              text: 'Cancel'
            },
            {
              text: 'Submit',
              onTouchTap: ::this.handleSubmit
            }
          ]}>
        <form onSubmit={::this.handleSubmit}>
          <TextField ref="text" fullWidth={true}/>
        </form>
      </Dialog>
    );
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    this.refs.dialog.dismiss();
  }

  handleShow() {
    this.refs.text.focus();
  }

  handleDissmiss() {
    const text = this.refs.text.getValue();
    if (text && this.callback) {
      this.callback(text);
    }
  }

  show(callback) {
    this.callback = callback;
    this.refs.dialog.show();
  }
}

export default ConstructDialog
