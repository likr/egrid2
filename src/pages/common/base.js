import m from 'mithril'

const view = (ctrl, args, children) => {
  return <div>
    <div className="ui fixed inverted menu">
      <div className="ui container">
        <a className="header item" href="/" config={m.route}>E-Grid</a>
      </div>
    </div>
    {children}
  </div>
};

export default {view}
