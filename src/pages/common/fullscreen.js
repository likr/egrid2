import m from 'mithril'
import Base from './base'

const view = (ctrl, args, children) => {
  return <Base>
    <div style={{
      overflow: 'hidden',
    }}>
      {children}
    </div>
  </Base>
};

export default {view}
