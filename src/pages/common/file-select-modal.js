/* global $ */

const handleChangeFile = (ctrl) => {
  return (event) => {
    ctrl.file = event.target.files[0];
  };
};

const config = (ctrl, {onregister}) => {
  return (element, init) => {
    if (!init) {
      onregister({
        show: ({title = '', onapprove}) => {
          Object.assign(ctrl, {title});
          $(element)
            .modal({
              onApprove: () => {
                onapprove(ctrl.file);
              },
            })
            .modal('show');
        },
      });
    }
  };
};

const controller = () => {
  return {
    title: '',
    file: null,
  };
};

const view = (ctrl, args) => {
  return <div className="ui modal" config={config(ctrl, args)}>
    <div className="header">{ctrl.title}</div>
    <div className="content">
      <div className="ui form">
        <div className="field">
          <label>File</label>
          <input type="file" onchange={handleChangeFile(ctrl)}/>
        </div>
      </div>
    </div>
    <div className="actions">
      <div className="ui cancel button">Cancel</div>
      <div className="ui primary approve button">OK</div>
    </div>
  </div>
};

export default {controller, view}
