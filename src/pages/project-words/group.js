import m from 'mithril'
import Word from './word'

const handleInputGroupName = (group) => {
  return (event) => {
    group.name = event.target.value;
  };
};

const handleInputGroupColor = (group) => {
  return (event) => {
    group.color = event.target.value;
  };
};

const view = (ctrl, {group, words, handleDropToGroup, handleDragOver}) => {
  return <div className="ui card" ondrop={handleDropToGroup} ondragover={handleDragOver}>
    <div className="content">
      <div className="ui form">
        <div className="two fields">
          <div className="field">
            <label>Name</label>
            <input type="text" value={group.name} oninput={handleInputGroupName(group)}/>
          </div>
          <div className="field">
            <label>Color</label>
            <input type="color" value={group.color} oninput={handleInputGroupColor(group)}/>
          </div>
        </div>
        <div className="field">
        </div>
      </div>
    </div>
    <div className="content" style={{'min-height': '100px'}}>
      {group.items.map((u) => <Word {...words[u]}/>)}
    </div>
  </div>
};

export default {view}
