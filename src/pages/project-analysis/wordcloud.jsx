import React from 'react'
import Word from '../common/word'

class WordCloud extends React.Component {
  render() {
    const {words, width, height} = this.props;
    return (
      <div className="ui card">
        <div className="content">
          <div className="header">Word Cloud</div>
        </div>
        <div className="content">
          <svg width={width} height={height}>
            <g transform={`translate(${width / 2},${height / 2})`}>
              {words.map((d) => {
                return <Word key={d.text} {...d}/>
              })}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default WordCloud
