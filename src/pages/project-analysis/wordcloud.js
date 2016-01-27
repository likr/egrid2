import m from 'mithril'
import d3 from 'd3';
import d3cloud from 'd3-cloud'
import LayoutWorker from '../../models/layout-worker'
import MorphWorker from '../../models/morph-worker'
import {calcMorph} from '../../intents/morph-worker'

const pos = new Set(['名詞', '動詞', '形容詞']);
const stopWords = new Set([
  '*',
  '、',
  'する',
  'れる',
  'いる',
  'やすい',
  'ある',
  'なる',
  'できる',
  'わかる',
]);

const count = (data) => {
  const wordCount = new Map();
  for (const paths of data) {
    for (const path of paths) {
      const word = path.basic_form;
      if (!pos.has(path.pos) || stopWords.has(word)) {
        continue;
      }
      if (!wordCount.has(word)) {
        wordCount.set(word, 0);
      }
      wordCount.set(word, wordCount.get(word) + 1);
    }
  }
  const words = Array.from(wordCount.entries()).map(([text, count]) => {
    return {text, count};
  });
  words.sort((word1, word2) => word2.count - word1.count);
  return words;
};

const textColor = d3.scale.category20();
const textSize = d3.scale.linear()
  .range([10, 30]);

const controller = () => {
  const ctrl = {
    cached: false,
    words: [],
  };
  LayoutWorker.subscribe(({data}) => {
    const {vertices} = data;
    calcMorph(vertices.map(({text}) => text));
  });
  MorphWorker.subscribe(({data}) => {
    const words = count(data);
    textSize.domain(d3.extent(words, ({count}) => count));
    d3cloud().size([400, 400])
      .words(words)
      .padding(1)
      .rotate(() => Math.random() * 120 - 60)
      .font('Impact')
      .fontSize((d) => textSize(d.count))
      .on('end', (layout) => {
        m.startComputation();
        ctrl.cached = false;
        ctrl.words = layout;
        m.endComputation();
      })
      .start();
  });
  return ctrl;
};

const view = (ctrl) => {
  if (ctrl.cached) {
    return {subtree: 'retain'};
  }
  ctrl.cached = true;

  return <g transform="translate(200,200)">
    {ctrl.words.map(({text, size, x, y, rotate}) => {
      return <text
          className="unselectable"
          style={{
            cursor: 'pointer',
          }}
          font-size={size}
          font-family='Impact'
          text-anchor='middle'
          transform={`translate(${x},${y})rotate(${rotate})`}
          fill={textColor(text)}>
        {text}
      </text>
    })}
  </g>
};

export default {controller, view}
