/* global $ */

const config = (ctrl, {onregister}) => {
  return (element, init) => {
    if (!init) {
      onregister({
        show: ({title = '', text = '', onapprove, ondeny}) => {
          Object.assign(ctrl, {title, text});
          $(element)
            .modal({
              onApprove: () => {
                onapprove();
              },
              onDeny: () => {
                ondeny();
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
  };
};

const view = (ctrl, args) => {
  return <div className="ui modal" config={config(ctrl, args)}>
    <div className="header">{ctrl.title}</div>
    <div className="content">
      {ctrl.text}
    </div>
    <div className="actions">
      <div className="ui cancel button">Cancel</div>
      <div className="ui primary approve button">OK</div>
    </div>
  </div>
};

export default {controller, view}
