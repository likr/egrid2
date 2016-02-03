import m from 'mithril'
import Base from './base'

const view = (ctrl, args, children) => {
  return <Base>
    <div
        className="ui container"
        style={{
          'background-color': '#fff',
          'padding': '50px 10px 40px',
          'margin-bottom': '40px',
          'box-shadow': '0 0 5px',
        }}>
      {children}
    </div>
  </Base>
};

export default {view}
