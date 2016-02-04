import m from 'mithril'

const handleDragStart = (u) => {
  return (event) => {
    event.dataTransfer.setData("text/plain", u);
  };
};

const view = (ctrl, {u, d}) => {
  return <div className="ui compact message" draggable="true" ondragstart={handleDragStart(u)} style={{margin: '5px'}}>{d.text}</div>
};

export default {view}
