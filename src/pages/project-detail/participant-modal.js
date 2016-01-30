/* global $ */

const config = (ctrl, {onregister}) => {
  return (element, init) => {
    if (!init) {
      onregister({
        show: ({title = '', data, onapprove}) => {
          ctrl.title = title;
          ctrl.data = data;
          $(element)
            .modal({
              onApprove: () => {
                onapprove(ctrl.data);
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
    data: {},
    approveButton: null,
  };
};

const view = (ctrl, args) => {
  return <div className="ui modal" config={config(ctrl, args)}>
    <div className="header">{ctrl.title}</div>
    <div className="content">
      <form className="ui form" onsubmit={(event) => {
        event.preventDefault();
        ctrl.approveButton.click();
      }}>
        <div className="field">
          <label>Name</label>
          <input
              placeholder="Participant name"
              type="text"
              value={ctrl.data.name}
              onchange={(event) => {
                ctrl.data.name = event.target.value;
              }}/>
        </div>
        <div className="field">
          <label>Note</label>
          <textarea
              onchange={(event) => {
                ctrl.data.note = event.target.value;
              }}>
            {ctrl.data.note}
          </textarea>
        </div>
      </form>
    </div>
    <div className="actions">
      <div className="ui cancel button">Cancel</div>
      <div className="ui primary approve button" config={(element) => {
        ctrl.approveButton = element;
      }}>
        Create
      </div>
    </div>
  </div>
};

export default {controller, view}
