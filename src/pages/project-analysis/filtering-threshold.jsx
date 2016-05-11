/* global $ */
import React from 'react'
import { setThreshold } from '../../intents/analysis'

class FilteringThreshold extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentValue: props.value,
    }
  }

  componentDidMount () {
    $(this.refs.slider)
      .on('input', (event) => {
        this.setState({
          currentValue: +event.target.value,
        })
      })
      .on('change', (event) => {
        setThreshold(+event.target.value)
      })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      currentValue: nextProps.value,
    })
  }

  render () {
    const {currentValue} = this.state
    return (
    <div>
      <h4 className="ui header">Filtering Threshold</h4>
      <div className="ui form">
        <div className="field">
          <label>
            {currentValue.toFixed(2)}
          </label>
          <input
            ref="slider"
            type="range"
            style={{width: '100%'}}
            min="0"
            max="1"
            step="0.01"
            value={currentValue} />
        </div>
      </div>
    </div>
    )
  }
}

export default FilteringThreshold
