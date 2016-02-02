import m from 'mithril'
import {setThreshold} from '../../intents/analysis'

const handleChange = (ctrl) => {
  return (event) => {
    ctrl.changing = false;
    setThreshold(+event.target.value);
  };
};

const handleInput = (ctrl) => {
  return (event) => {
    ctrl.changing = true;
    ctrl.value = +event.target.value;
  };
};

const controller = ({value}) => {
  return {
    changing: false,
    value,
  };
};

const view = (ctrl, args) => {
  const value = ctrl.changing ? ctrl.value : args.value;

  return <div className="ui card" style={{transition: 'opacity .5s ease', opacity: args.show ? 1 : 0}}>
    <div className="content">
      <div className="header">Filtering Threshold</div>
    </div>
    <div className="content">
      <div className="ui form">
        <div className="field">
          <label>{value.toFixed(2)}</label>
          <input
              type="range" style={{width: '100%'}}
              min="0" max="1" step="0.01" value={value}
              oninput={handleInput(ctrl)} onchange={handleChange(ctrl)}/>
        </div>
      </div>
    </div>
  </div>
};

export default {controller, view}
