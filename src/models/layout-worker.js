/* global document */

import Rx from 'rx-dom'
import {CALC_LAYOUT} from '../constants'
import {intentSubject} from '../intents/layout-worker'

const calcSize = (texts, size, family) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${size}pt ${family}`;
  const result = {};
  for (const text of texts) {
    result[text] = {
      width: ctx.measureText(text).width,
      height: size * 1.5,
    };
  }
  return result;
};

const subject = Rx.DOM.fromWorker('layout-worker.js');

const calc = (data, options) => {
  const {vertexScale, edgeScale, layerMargin, vertexMargin, edgeMargin} = options;
  const size = calcSize(data.vertices.map(({d}) => d.text), 10, 'sans-serif');
  for (const {u, d} of data.vertices) {
    const scale = vertexScale({u, d});
    d.width = size[d.text].width * scale;
    d.height = size[d.text].height * scale;
  }
  for (const {u, v, d} of data.edges) {
    d.width = 2 * edgeScale({u, v, d});
  }
  data.options = {layerMargin, vertexMargin, edgeMargin};
  subject.onNext(data);
};

intentSubject.subscribe((payload) => {
  switch (payload.type) {
    case CALC_LAYOUT:
      calc(payload.data, payload.options);
      break;
  }
});

export default subject.share()