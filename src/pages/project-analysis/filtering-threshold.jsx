import React from 'react'
import {setThreshold} from '../../intents/analysis'

class FilteringThreshold extends React.Component {
  render() {
    const {value} = this.props;
    return (
      <div>
        <h4 className="ui header">Filtering Threshold</h4>
        <div className="ui form">
          <div className="field">
            <label>{value.toFixed(2)}</label>
            <input
                type="range" style={{width: '100%'}}
                min="0" max="1" step="0.01" value={value}
                onChange={this.handleChange.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }

  handleChange(event) {
    setThreshold(+event.target.value);
  }
}

export default FilteringThreshold
