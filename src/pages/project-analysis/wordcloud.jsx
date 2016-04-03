import React from 'react'
import Word from '../common/word'

class WordCloud extends React.Component {
  render() {
    const {words, width, height} = this.props;
    return (
      <div>
        <h4 className="ui header">Word Cloud</h4>
        <svg width={width} height={height} style={{backgroundColor: 'white'}}>
          <g transform={`translate(${width / 2},${height / 2})`}>
            {words.map((d) => {
              return <Word key={d.text} {...d}/>
            })}
          </g>
        </svg>
      </div>
    );
  }
}

export default WordCloud
