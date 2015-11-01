import React from 'react'
import Dialog from 'material-ui/lib/dialog'
import TextField from 'material-ui/lib/text-field'

class ProjectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEmpty: false
    };
  }

  render() {
    return (
      <Dialog
        title={this.props.title}
        ref="dialog"
        onShow={::this.handleShow}
        actions={[
          {
            text: 'Cancel'
          },
          {
            text: 'Submit',
            onTouchTap: ::this.submit
          }
        ]}>
        <form onSubmit={::this.handleSubmit}>
          <TextField
            ref="name"
            fullWidth={true}
            floatingLabelText="Project Name"
            errorText={this.state.nameEmpty ? 'name is required' : ''}/>
          <TextField
            ref="note"
            fullWidth={true}
            floatingLabelText="Note"
            multiLine={true}
            rows={3}/>
        </form>
      </Dialog>
    );
  }

  handleShow() {
    this.refs.name.setValue(this.props.name || '');
    this.refs.note.setValue(this.props.note || '');
    this.refs.name.focus();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.submit();
  }

  submit() {
    const projectId = this.props.projectId || null;
    const name = this.refs.name.getValue();
    const note = this.refs.note.getValue();
    if (name) {
      this.setState({
        nameEmpty: false
      });
      this.props.onSubmit({projectId, name, note});
      this.dismiss();
    } else {
      this.setState({
        nameEmpty: true
      });
    }
  }

  show() {
    this.refs.dialog.show();
  }

  dismiss() {
    this.refs.dialog.dismiss();
  }
}

export default ProjectDialog
