import m from 'mithril'
import Base from './base'

const view = (ctrl, args, children) => {
  return <Base>
    <div
        className="ui container"
        style={{
          'background-color': '#fff',
          'padding': '50px 10px 10px',
          'margin-bottom': '40px',
          'box-shadow': '0 0 5px',
          'min-height': 'calc(100vh - 40px)',
        }}>
      {children}
    </div>
  </Base>
};

export default {view}
