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
  };
};

const view = (ctrl, args) => {
  return <div className="ui modal" config={config(ctrl, args)}>
    <div className="header">{ctrl.title}</div>
    <div className="content">
      <form className="ui form" onsubmit={(event) => {
        event.preventDefault();
      }}>
        <div className="field">
          <label>Name</label>
          <input
              placeholder="Project name"
              type="text"
              value={ctrl.data.name}
              onchange={(event) => {
                ctrl.data.name = event.target.value;
              }}/>
        </div>
        <div className="field">
          <label>Note</label>
          <textarea
              name="projectNote"
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
      <div className="ui primary approve button">Create</div>
    </div>
  </div>
};

export default {controller, view}
