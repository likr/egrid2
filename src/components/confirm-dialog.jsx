import React from 'react'
import Dialog from 'material-ui/lib/dialog'

class ConfirmDialog extends React.Component {
  render() {
    return (
      <Dialog
        title={this.props.title}
        ref="dialog"
        actions={[
          {
            text: 'Cancel',
            onTouchTap: () => {
              this.reject();
              this.dismiss();
            }
          },
          {
            text: 'OK',
            onTouchTap: () => {
              this.resolve();
              this.dismiss();
            }
          }
        ]}>
      </Dialog>
    );
  }

  show() {
    this.refs.dialog.show();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  dismiss() {
    this.refs.dialog.dismiss();
  }
}

export default ConfirmDialog
