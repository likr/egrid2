/* global $ */

const config = (ctrl, {onregister}) => {
  return (element, init) => {
    if (!init) {
      onregister({
        show: ({title = '', text = '', onapprove}) => {
          Object.assign(ctrl, {title, text});
          $(element)
            .modal({
              onApprove: () => {
                onapprove(ctrl.text);
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
    text: '',
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
          <label>評価項目の入力</label>
          <input
              value={ctrl.text}
              onchange={(event) => {
                ctrl.text = event.target.value;
              }}/>
        </div>
      </form>
    </div>
    <div className="actions">
      <div className="ui cancel button">Cancel</div>
      <div className="ui primary approve button" config={(element) => {
        ctrl.approveButton = element;
      }}>
        OK
      </div>
    </div>
  </div>
};

export default {controller, view}
