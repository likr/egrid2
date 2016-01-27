import m from 'mithril'
import Base from './base'

const view = (ctrl, args, children) => {
  return <Base>
    <div
        className="ui container"
        style={{
          'padding-top': '50px',
        }}>
      {children}
    </div>
  </Base>
};

export default {view}
